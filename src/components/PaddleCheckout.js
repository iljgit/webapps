// components/PaddleCheckout.js
import { useEffect, useState } from "react";
import { initializePaddle } from "@paddle/paddle-js";
import { Button } from "@mui/material";

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

const PaddleCheckout = ({ priceId }) => {
  const paddle = usePaddle();

  function openCheckout(priceId) {
    if (!paddle) return;

    paddle.Checkout.open({
      items: [
        {
          priceId: priceId,
          quantity: 1,
        },
      ],
    });
  }

  return (
    <Button
      onClick={() => openCheckout(priceId)}
      variant="contained"
      color="secondary"
    >
      Buy now
    </Button>
  );
};

export default PaddleCheckout;
