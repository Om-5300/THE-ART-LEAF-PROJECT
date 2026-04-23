import { verifyAuth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { dbConnect } from "@/lib/db";
import { Gallery } from "@/models/Gallery";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const items = await Gallery.find().sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Could not load gallery" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    verifyAuth(req);
    await dbConnect();

    const form = await req.formData();
    const title = String(form.get("title") || "").trim();
    const category = String(form.get("category") || "").toLowerCase().trim();
    const description = String(form.get("description") || "").trim();
    const imageBase64 = form.get("imageBase64") as string | null;
    const imageType = form.get("imageType") as string | null;

    if (!title || title.length < 3) {
      return NextResponse.json({ error: "Title is required and must be at least 3 characters." }, { status: 400 });
    }

    if (!imageBase64) {
      return NextResponse.json({ error: "Image is required." }, { status: 400 });
    }

    // Check base64 size (approx 5MB for Vercel limit)
    if (imageBase64.length > 5 * 1024 * 1024 * 4 / 3) {
      return NextResponse.json({ error: "Image size must be less than 5MB." }, { status: 400 });
    }

    if (!imageType || !imageType.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image." }, { status: 400 });
    }

    const validCategories = ["fabric", "wedding", "jewellery"];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category. Must be one of: fabric, wedding, jewellery." }, { status: 400 });
    }

    const upload = await cloudinary.uploader.upload(imageBase64, { folder: "the-art-leaf" });

    const created = await Gallery.create({ title, category, description, imageUrl: upload.secure_url });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Gallery upload error:", error);
    return NextResponse.json({ error: "Could not upload image" }, { status: 500 });
  }
}

