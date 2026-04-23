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

    // ✅ get JSON (not formData)
    const body = await req.json();

    const title = String(body.title || "").trim();
    const category = String(body.category || "").toLowerCase().trim();
    const description = String(body.description || "").trim();
    const image = String(body.image || "").trim(); // ✅ Cloudinary URL

    // ✅ validations
    if (!title || title.length < 3) {
      return NextResponse.json(
        { error: "Title must be at least 3 characters." },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { error: "Image URL is required." },
        { status: 400 }
      );
    }
    
    const validCategories = ["fabric", "wedding", "jewellery", "saree-resa", "kuttchi-bharat"];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category." },
        { status: 400 }
      );
    }

    // ✅ save directly (NO cloudinary upload here)
    const created = await Gallery.create({
      title,
      category,
      description,
      imageUrl: image, // ✅ IMPORTANT
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Gallery POST error:", error);
    return NextResponse.json(
      { error: "Could not save gallery item" },
      { status: 500 }
    );
  }
}

