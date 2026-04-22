import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { Gallery } from "@/models/Gallery";

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
    const title = String(form.get("title") || "");
    const category = String(form.get("category") || "").toLowerCase().trim();
    const description = String(form.get("description") || "");
    const image = form.get("image") as File | null;

    if (!title.trim() || !image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    if (!["fabric", "wedding", "jewellery"].includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const dataUri = `data:${image.type};base64,${buffer.toString("base64")}`;
    const upload = await cloudinary.uploader.upload(dataUri, { folder: "the-art-leaf" });

    const created = await Gallery.create({ title: title.trim(), category, description: description.trim(), imageUrl: upload.secure_url });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not upload image" }, { status: 500 });
  }
}

