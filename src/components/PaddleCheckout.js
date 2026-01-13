"use client";
import { useEffect, useState } from "react";
import { initializePaddle } from "@paddle/paddle-js";
import { Button } from "@mui/material";
import { useSession } from "next-auth/react";

/*
Example return data from Paddle Prices API:

{
    "name": "checkout.loaded",
    "data": {
        "id": "che_01kesk9324kbg3sm4qp5mx2thr",
        "transaction_id": "txn_01kesk92zqvprj94zgvgs7cxjn",
        "status": "draft",
        "custom_data": null,
        "currency_code": "GBP",
        "customer": {
            "id": "ctm_01kes1am62zbzcf3t8matpspx7",
            "email": "ilj+iseemy@breato.co.uk",
            "address": null,
            "business": null
        },
        "items": [
            {
                "price_id": "pri_01ke9jqganp5fqg81v69e3bq0b",
                "price_name": "Standard - Monthly",
                "product": {
                    "id": "pro_01ke9jm55kpm8dfzctcjx3x6v6",
                    "name": "IP Decoder",
                    "description": null,
                    "image_url": null
                },
                "billing_cycle": {
                    "interval": "month",
                    "frequency": 1
                },
                "trial_period": null,
                "quantity": 1,
                "totals": {
                    "subtotal": 4.16,
                    "tax": 0.83,
                    "total": 4.99,
                    "discount": 0,
                    "balance": 4.99,
                    "credit": 0
                },
                "recurring_totals": {
                    "subtotal": 4.16,
                    "tax": 0.83,
                    "discount": 0,
                    "total": 4.99
                }
            }
        ],
        "totals": {
            "subtotal": 4.16,
            "tax": 0.83,
            "total": 4.99,
            "discount": 0,
            "credit": 0,
            "balance": 4.99
        },
        "payment": {
            "method_details": {
                "type": "none"
            }
        },
        "settings": {
            "display_mode": "wide-overlay",
            "theme": "light",
            "variant": "one-page"
        },
        "recurring_totals": {
            "subtotal": 4.16,
            "tax": 0.83,
            "discount": 0,
            "total": 4.99,
            "balance": 4.99,
            "credit": 0
        },
        "upsell": null
    }
}
    */

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

const PaddleCheckout = ({
  productId,
  priceId,
  customData,
  buttonText = "Buy now",
  isFreeTrial = false,
}) => {
  const paddle = usePaddle();

  const { data: session } = useSession();
  const user = session?.user || {};

  function startFreeTrial() {
    return;
  }

  function openCheckout() {
    if (!paddle) return;

    paddle.Checkout.open({
      items: [
        {
          priceId,
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
      onClick={isFreeTrial ? startFreeTrial : openCheckout}
      variant="contained"
      color="secondary"
      size="small"
      sx={{ width: "100%" }}
    >
      {buttonText}
    </Button>
  );
};

export default PaddleCheckout;
