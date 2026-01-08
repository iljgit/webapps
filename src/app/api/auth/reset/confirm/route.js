import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const url = `${process.env.ISEEMY_API_URL}/iseemy/resetpassword`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ISEEMY_API_KEY}`,
    },
    body: JSON.stringify({ data: { resetToken, passwordHash } }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Reset link expired or invalid" },
      { status: 400 }
    );
  }

  const result = await response.json();

  if (!result?.success) {
    return NextResponse.json(
      { error: result?.message || "Reset link expired or invalid" },
      { status: 400 }
    );
  } else {
    return NextResponse.json({ success: true });
  }
}
