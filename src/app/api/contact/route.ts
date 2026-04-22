import { verifyAuth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Contact } from "@/models/Contact";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    verifyAuth(req);
    await dbConnect();
    const messages = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const created = await Contact.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not save message" }, { status: 500 });
  }
}

