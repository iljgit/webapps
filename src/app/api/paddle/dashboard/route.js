export async function POST(request) {
  const vendorId = process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID;
  const apiKey = process.env.PADDLE_PRODUCT_API_KEY;
  const urlRoot = process.env.PADDLE_URL_ROOT;

  if (!vendorId || !apiKey) {
    return new Response(
      JSON.stringify({ error: "Payment gateway credentials not set" }),
      {
        status: 500,
      }
    );
  }

  try {
    const body = await request.json();
    const { customerId } = { ...body };
    if (!customerId) {
      return new Response(JSON.stringify({ error: "Unknown user" }), {
        status: 500,
      });
    }

    // get the prices
    const response = await fetch(
      `${urlRoot}customers/${customerId}/portal-sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res
        .status(500)
        .json({ error: "Failed to fetch user overview", details: data });
    }

    return new Response(JSON.stringify(data.data), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
