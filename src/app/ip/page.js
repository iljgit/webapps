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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Hero from "@/components/Hero";
import PaddleCheckout from "@/components/PaddleCheckout";
import SubscriptionCard from "@/components/SubscriptionCard";
import { useSession } from "next-auth/react";

export default function IPPage() {
  const defOutput = "Enter a valid IP address and click Decode.";
  const [output, setOutput] = useState(defOutput);
  const [ipAddress, setIpAddress] = useState("");
  const [prices, setPrices] = useState([]);
  const [userData, setUserData] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [processResults, setProcessResults] = useState(null);

  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const processSubscriptionResult = (params) => {
    setProcessResults(params);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setRefresh(Date.now());
    setDialogOpen(false);
  };

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
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/userdata");
        if (response.ok) {
          const data = await response.json();
          const user = data.user;

          setUserData(user);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };

    if (status !== "authenticated") {
      return;
    }

    fetchUserData();
  }, [status, refresh]);

  useEffect(() => {
    const fetchPrices = async () => {
      const sort = (a, b) => {
        const aDisplayOrder = a?.custom_data?.display_order || 9999;
        const bDisplayOrder = b?.custom_data?.display_order || 9999;

        if (aDisplayOrder !== bDisplayOrder) {
          return aDisplayOrder - bDisplayOrder;
        } else {
          return 0;
        }
      };

      const res = await fetch("/api/paddle/products", {
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

      setPrices(data);
    };

    fetchPrices();
  }, [refresh]);

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
        {!isAuthenticated && (
          <Typography variant="body1" gutterBottom={true} sx={{ mb: 2 }}>
            You must register / log in to subscribe
          </Typography>
        )}
      </Container>
      <Container sx={{ px: { xs: 2, md: 0 } }}>
        <Grid container sx={{ px: { xs: 2, md: 0 } }}>
          {prices.map((p, index) => {
            const isFreeTrial = p?.custom_data?.trial === "true";
            const buttonText = isFreeTrial
              ? "Start Free Trial"
              : "Subscribe Now";
            const unitPrice = isFreeTrial
              ? p?.custom_data?.period || "14 days"
              : `${(p.unit_price.amount / 100).toFixed(2)} ${
                  p.unit_price.currency_code
                } / ${p.billing_cycle.interval}`;

            let buttonDisabled = false;
            if (!isAuthenticated) {
              buttonDisabled = true;
            } else if (!userData) {
              buttonDisabled = true;
            } else if (isFreeTrial && userData?.plan["ip"]) {
              buttonDisabled = true;
            }

            const features = p?.custom_data?.features?.split(";;") || [];

            const body = (
              <>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {unitPrice}
                </Typography>
                {features.length > 0 && (
                  <ul style={{ paddingLeft: "20px" }}>
                    {features.map((feature, idx) => (
                      <li key={`feature_${idx}`}>{feature}</li>
                    ))}
                  </ul>
                )}
              </>
            );
            return (
              <Grid
                key={`product_${index}`}
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                sx={{ display: "flex", justifyContent: "center", p: 2 }}
              >
                <SubscriptionCard
                  title={p.name}
                  body={body}
                  imageUrl={"/assets/ip.jpg"}
                  boxShadow={3}
                  button={
                    <PaddleCheckout
                      product={p}
                      productCode="ip"
                      isFreeTrial={isFreeTrial}
                      buttonText={buttonText}
                      buttonDisabled={buttonDisabled}
                      callback={processSubscriptionResult}
                    />
                  }
                />
              </Grid>
            );
          })}
        </Grid>
      </Container>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ color: processResults?.success ? "darkgreen" : "darkred" }}
        >
          Subscription
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {processResults?.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
