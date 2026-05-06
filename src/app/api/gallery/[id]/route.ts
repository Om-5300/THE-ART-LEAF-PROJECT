import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { Gallery } from "@/models/Gallery";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAuth(req);
    await dbConnect();
    const body = await req.json();
    const { id } = await params;

    const title = String(body.title || "").trim();
    const category = String(body.category || "").toLowerCase().trim();
    const description = String(body.description || "").trim();
    const imageUrl = String(body.image || "").trim();

    if (!title || !category || !imageUrl) {
      return NextResponse.json({ error: "Title, Category and Image are required." }, { status: 400 });
    }

    const updated = await Gallery.findByIdAndUpdate(
      id,
      { title, category, description, imageUrl },
      { new: true }
    );
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Gallery PUT error:", error);
    return NextResponse.json({ error: "Could not update gallery item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAuth(req);
    await dbConnect();
    const { id } = await params;
    await Gallery.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not delete image" }, { status: 500 });
  }
}

