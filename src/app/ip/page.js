"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import Hero from "@/components/Hero";
import PaddleCheckout from "@/components/PaddleCheckout";
import SubscriptionCard from "@/components/SubscriptionCard";

export default function IPPage() {
  const defOutput = "Enter a valid IP address and click Decode.";
  const [output, setOutput] = useState(defOutput);
  const [ipAddress, setIpAddress] = useState("");
  const [prices, setPrices] = useState([]);

  const handleInputChange = (event) => {
    setIpAddress(event.target.value);
    if (output !== defOutput) {
      setOutput(defOutput);
    }
  };

  const handleDecode = async () => {
    if (!ipAddress) {
      setOutput("Please enter a valid IP address.");
      return;
    }

    try {
      setOutput(<CircularProgress />);

      const data = { action: "ip", data: { data: { ip: ipAddress } } };
      const response = await fetch("/api/iseemyapi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Could not contact API server");
      }

      const resp = await response.json();

      setOutput(<pre>{JSON.stringify(resp, null, 2)}</pre>);
    } catch (error) {
      setOutput(
        `There was an error checking the ip address ${ipAddress}: ${error.message}`
      );
    }
  };

  useEffect(() => {
    const fetchPrices = async () => {
      const sort = (a, b) => {
        if (a.billing_cycle.interval === b.billing_cycle.interval) return 0;
        return a.billing_cycle.interval < b.billing_cycle.interval ? -1 : 1;
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productCode: "IPDECODER" }),
      });

      if (!res.ok) {
        return console.error("Failed to fetch prices");
      }

      let data = await res.json();
      data = data.sort(sort);
      console.log("Fetched prices:", data);
      setPrices(data);
    };

    fetchPrices();
  }, []);

  return (
    <>
      <Hero
        title="IP Decoder"
        subtitle="Identify your users' connection details in real time."
        imageUrl="/assets/ip.jpg"
      />
      <Container sx={{ px: { xs: 2, md: 0 }, mb: 4 }}>
        <Typography variant="h4" gutterBottom={true} sx={{ mb: 2 }}>
          IP Decoder
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          Using our extensive database of ipv4 and ipv6 addresses and proxies,
          we can find out where in the world an ip address originates.
        </Typography>
        <Typography variant="body1">
          Our database is updated regularly to ensure the best possible results.
        </Typography>
      </Container>
      <Container sx={{ px: { xs: 2, md: 0 } }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Try it out here
        </Typography>
        <Typography variant="body1">
          Enter an IP address below and click &quot;Decode&quot; to see the
          decoder in action. The results, in JSON format, will be shown below.
        </Typography>
        <Grid container spacing={2} sx={{ my: 2, mb: 4 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              id="ipinput"
              label="IP Address"
              variant="outlined"
              onChange={handleInputChange}
              value={ipAddress}
            />
          </Grid>

          <Box width="100%" />

          <Grid size={{ xs: 12, md: 8 }}>
            <Button variant="contained" onClick={handleDecode}>
              Decode
            </Button>
          </Grid>

          <Box width="100%" />

          <Grid size={{ xs: 12, md: 8 }}>
            <div variant="contained">{output}</div>
          </Grid>
        </Grid>
      </Container>
      <Container sx={{ px: { xs: 2, md: 0 } }}>
        <Typography variant="h4" gutterBottom={true} sx={{ mb: 2 }}>
          Subscribe now
        </Typography>
      </Container>
      <Container sx={{ px: { xs: 2, md: 0 } }}>
        <Grid container sx={{ px: { xs: 2, md: 0 } }}>
          {prices.map((p, index) => {
            const unitPrice = `${(p.unit_price.amount / 100).toFixed(2)} ${
              p.unit_price.currency_code
            } / ${p.billing_cycle.interval}`;
            const body = (
              <>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {unitPrice}
                </Typography>
                <Typography variant="body2">{p.description}</Typography>
              </>
            );
            return (
              <Grid
                key={`product_${index}`}
                size={{ xs: 12, md: 4, lg: 3 }}
                sx={{ display: "flex", justifyContent: "center", p: 2 }}
              >
                <SubscriptionCard
                  title={p.name}
                  body={body}
                  imageUrl={"/assets/ip.jpg"}
                  boxShadow={3}
                  button={
                    <PaddleCheckout productId={p.product_id} priceId={p.id} />
                  }
                />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
}
