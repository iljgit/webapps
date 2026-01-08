"use client";
import { useEffect, useState } from "react";
import { initializePaddle } from "@paddle/paddle-js";
import { Button } from "@mui/material";
import { useSession } from "next-auth/react";

const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
const isSandbox = process.env.NEXT_PUBLIC_PADDLE_SANDBOX === "true";

const usePaddle = () => {
  const [paddle, setPaddle] = useState();

  useEffect(() => {
    const initObj = {
      environment: isSandbox ? "sandbox" : "production",
      token,
      eventCallback: function (data) {
        console.log("Paddle event callback", data);
      },
      checkout: {
        settings: {
          variant: "one-page",
        },
      },
    };

    initializePaddle(initObj).then((paddleInstance) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    });
  }, []);

  return paddle;
};

const PaddleCheckout = ({ priceId, text = "Buy now" }) => {
  const paddle = usePaddle();

  const { data: session } = useSession();
  const user = session?.user || {};

  function openCheckout(priceId) {
    if (!paddle) return;

    paddle.Checkout.open({
      items: [
        {
          priceId: priceId,
          quantity: 1,
        },
      ],
      customer: {
        email: user.email,
        name: user.name,
      },
    });
  }

  return (
    <Button
      onClick={() => openCheckout(priceId)}
      variant="contained"
      color="secondary"
    >
      {text}
    </Button>
  );
};

export default PaddleCheckout;
