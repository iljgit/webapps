export async function POST(request) {
  const vendorId = process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID;
  const apiKey = process.env.PADDLE_PRODUCT_API_KEY;
  const isSandbox = process.env.NEXT_PUBLIC_PADDLE_SANDBOX === "true";

  // const url = "https://vendors.paddle.com/api/2.0/product/get_products";
  const urlRoot = isSandbox
    ? "https://sandbox-api.paddle.com/"
    : "https://api.paddle.com/";

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
    const { productCode } = { ...body };
    const productId = process.env[`PADDLE_${productCode}_PRODUCT_ID`];
    if (!productId) {
      return new Response(JSON.stringify({ error: "Unknown product" }), {
        status: 500,
      });
    }

    // get the prices
    const response = await fetch(
      `${urlRoot}prices?status=active&product_id=${productId}`,
      {
        method: "GET",
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
        .json({ error: "Failed to fetch products", details: data });
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
