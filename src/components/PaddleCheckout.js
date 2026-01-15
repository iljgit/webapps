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

const registerProduct = async (params) => {
  const { product, user, transaction, productCode, callback, isFreeTrial } = {
    ...params,
  };

  try {
    const _product = {};
    const _transaction = {};

    _product.id = product.id;
    _product.billingCycle = product.billing_cycle;
    _product.customData = product.custom_data;
    _product.unitPrice = product.unit_price;
    _product.name = product.name;
    _product.description = product.description;

    _transaction.customer = transaction.customer;
    _transaction.id = transaction.id;
    _transaction.transactionId = transaction.transaction_id;
    _transaction.status = transaction.status;

    const body = {
      action: "subscribe",
      productCode,
      product: _product,
      user,
      transaction: _transaction,
      isFreeTrial,
    };

    const response = await fetch("/api/user/subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      if (callback) {
        callback(data);
      }
    } else {
      console.error(
        "Failed to register product#2",
        product,
        user,
        transaction,
        response.status
      );

      if (callback) {
        callback({
          success: false,
          message:
            "Your subscription could not be processed. Please try again later.",
        });
      }
    }
  } catch (error) {
    console.error(
      "Failed to register product#1",
      product,
      user,
      transaction,
      error
    );
    callback({
      success: false,
      message:
        "There was a problem contacting our server. Please try again later.",
    });
  }
};

const usePaddle = (product, user, isFreeTrial, productCode, callback) => {
  const [paddle, setPaddle] = useState();

  useEffect(() => {
    const initObj = {
      environment: isSandbox ? "sandbox" : "production",
      token,
      eventCallback: function (transaction) {
        if (transaction.name === "checkout.completed") {
          registerProduct({
            product,
            user,
            transaction: transaction.data,
            isFreeTrial,
            productCode,
            callback,
          });
        }
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
  }, [product, user, isFreeTrial, productCode, callback]);

  return paddle;
};

const PaddleCheckout = ({
  product,
  productCode,
  buttonText = "Buy now",
  isFreeTrial = false,
  buttonDisabled = false,
  callback,
}) => {
  const {
    id: priceId,
    product_id: productId,
    custom_data: customData,
  } = product;

  const { data: session } = useSession();
  const user = session?.user || {};

  const paddle = usePaddle(product, user, isFreeTrial, productCode, callback);

  function startFreeTrial() {
    registerProduct({
      product,
      user,
      transaction: {
        source: "iseemy",
        customer: { name: user.name, email: user.email },
        id: `iseemyche_${Date.now()}_${user.email}`,
        transaction_id: `iseemytxn_${Date.now()}_${user.email}`,
        status: "processed",
      },
      isFreeTrial,
      productCode,
      callback,
    });
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
      disabled={buttonDisabled}
    >
      {buttonText}
    </Button>
  );
};

export default PaddleCheckout;
