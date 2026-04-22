import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { Service } from "@/models/Service";

export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find().sort({ createdAt: -1 });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: "Could not load services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    verifyAuth(req);
    await dbConnect();
    const body = await req.json();
    const title = String(body.title || "").trim();
    const icon = String(body.icon || "").trim();
    const shortDescription = String(body.shortDescription || "").trim();
    const description = String(body.description || "").trim();

    if (!title || !icon || !shortDescription || !description) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    const created = await Service.create({ title, icon, shortDescription, description });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Could not create service" }, { status: 500 });
  }
}

