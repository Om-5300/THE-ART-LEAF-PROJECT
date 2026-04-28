import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { Service } from "@/models/Service";
import mongoose from "mongoose";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    let service;
    if (mongoose.Types.ObjectId.isValid(id)) {
      service = await Service.findById(id);
    } else {
      // Try finding by title if ID is not a valid ObjectId (for fallback services)
      const decodedTitle = decodeURIComponent(id);
      service = await Service.findOne({ title: decodedTitle });
    }

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch {
    return NextResponse.json({ error: "Could not fetch service" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAuth(req);
    await dbConnect();
    const body = await req.json();
    const { id } = await params;

    const title = String(body.title || "").trim();
    const icon = String(body.icon || "").trim();
    const shortDescription = String(body.shortDescription || "").trim();
    const description = String(body.description || "").trim();

    if (!title || !icon || !shortDescription || !description) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const updated = await Service.findByIdAndUpdate(id, { title, icon, shortDescription, description }, { new: true });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Could not update service" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAuth(req);
    await dbConnect();
    const { id } = await params;
    await Service.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not delete service" }, { status: 500 });
  }
}

