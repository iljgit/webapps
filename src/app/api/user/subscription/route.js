import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // NextAuth stores the 'token' data in the session object on the server
  // Note: Depending on your setup, you may need to use 'getToken'
  // to access the raw 'backendId' if it's not in the session.
  const id = session.user.backendId;
  const data = await request.json();

  data._id = id;
  data.action = "subscribe";

  const url = `${process.env.ISEEMY_API_URL}/iseemy/subscription`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ISEEMY_API_KEY}`,
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    return null;
  }

  const userData = await response.json();

  if (userData?.success) {
    return NextResponse.json(userData);
  } else {
    return NextResponse.json(
      { error: userData?.message || "Error retrieving user data" },
      { status: 400 }
    );
  }
}
