import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const url = `${process.env.ISEEMY_API_URL}/iseemy/initiatepasswordreset`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ISEEMY_API_KEY}`,
      },
      body: JSON.stringify({ data: { email } }),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "The server couldn't be contacted. Please try again shortly.",
        },
        { status: 400 }
      );
    }

    const userData = await response.json();

    if (!userData || !userData.success) {
      return NextResponse.json(
        { error: userData?.message || "The email coudn't be found" },
        { status: 400 }
      );
    } else {
      return NextResponse.json({ success: true });
    }
  } catch (err) {
    console.error("Password reset request error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
