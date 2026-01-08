import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const url = `${process.env.ISEEMY_API_URL}/iseemy/registration`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ISEEMY_API_KEY}`,
    },
    body: JSON.stringify({ data: { email, name, passwordHash } }),
  });

  if (!response.ok) {
    return null;
  }

  const userData = await response.json();

  if (userData?.success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json(
      { error: userData?.message || "Email already registered" },
      { status: 400 }
    );
  }
}
