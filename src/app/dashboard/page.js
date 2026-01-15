"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button, Container, Typography, Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Hero from "@/components/Hero";
import CircularProgress from "@mui/material/CircularProgress";

function Plan({ index, plan }) {
  const keyRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    if (plan.isFreeTrial || !plan?.transaction?.customer?.id) {
      return;
    }

    const fetchLinks = async () => {
      const res = await fetch("/api/paddle/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId: plan.transaction.customer.id }),
      });

      if (!res.ok) {
        return console.error("Failed to fetch overviews");
      }

      let data = await res.json();
      setOverview(data?.urls?.general?.overview);
    };

    fetchLinks();
  }, [plan.isFreeTrial, plan?.transaction?.customer?.id]);

  const handleCopy = async (ref) => {
    if (ref.current) {
      try {
        // Extract text from the ref
        const textToCopy = ref.current.innerText;

        // Use the modern Clipboard API
        await navigator.clipboard.writeText(textToCopy);

        // Show success feedback
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }
  };

  return (
    <React.Fragment key={`plan_${index}`}>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        {plan.description}
      </Typography>
      <Typography variant="body" sx={{ mt: 2, mb: 1 }}>
        URL
      </Typography>
      <Typography
        ref={keyRef}
        variant="body1"
        sx={{
          p: 2,
          backgroundColor: "background.paper",
          border: "1px solid #E2E8F0",
          borderRadius: 1,
          fontFamily: "monospace",
          width: "100%",
          overflowWrap: "break-word", // Modern standard
          wordBreak: "break-word", // Compatibility fallback
        }}
      >
        {plan.url}
      </Typography>
      <Typography sx={{ mt: 2 }}>
        <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
          <Button
            component="span"
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => handleCopy(keyRef)}
          >
            Copy URL
          </Button>
        </Tooltip>
        {overview && (
          <Tooltip title={"Manage your payment details"}>
            <Button
              component="a"
              variant="contained"
              color="success"
              sx={{ mr: 2 }}
              href={overview}
              target="_blank"
              rel="noopener noreferrer"
            >
              Payment details
            </Button>
          </Tooltip>
        )}
      </Typography>
    </React.Fragment>
  );
}

export default function DashboardPage() {
  const apiKeyRef = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialog2Open, setDialog2Open] = useState(false);
  const [dialog2Details, setDialog2Details] = useState({});
  const [copied, setCopied] = useState(false);
  const [userData, setUserData] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const { status } = useSession();

  useEffect(() => {
    // Fetch the API key from the server when the component mounts
    const fetchUserData = async () => {
      const sortPlans = (a, b) => {
        const ad = a.description.toUpperCase();
        const bd = b.description.toUpperCase();

        if (ad === bd) {
          return 0;
        } else if (ad < bd) {
          return -1;
        } else {
          return 1;
        }
      };
      try {
        const response = await fetch("/api/user/userdata");
        if (response.ok) {
          const data = await response.json();
          const user = data.user;

          const plan = user.plan;
          const plans = [];

          for (const key in plan) {
            plans.push(plan[key]);
          }

          user.plans = plans.sort(sortPlans);

          setUserData(user);

          if (apiKeyRef.current) {
            apiKeyRef.current.innerText = user.jwt;
          }
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

  if (["authenticated", "loading"].indexOf(status) < 0) {
    return redirect("/api/auth/signin");
  }

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleClose2 = () => {
    setDialog2Open(false);
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const openDialog2 = () => {
    setDialog2Open(true);
  };

  const handleRegenerate = () => {
    const process = async () => {
      const response = await fetch("/api/user/resetjwt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jwt: userData.jwt }),
      });

      if (!response.ok) {
        setDialogOpen(false);
        setDialog2Details({
          success: false,
          message:
            "There was a server error. Please wait a short time and try again.",
        });
        setDialog2Open(true);
      } else {
        const resp = await response.json();
        if (resp.success) {
          setDialogOpen(false);
          setDialog2Details({
            success: true,
            message:
              "Your new API Key is shown. You should start using it immediately.",
          });
          setDialog2Open(true);
          setRefresh(Date.now());
        } else {
          setDialogOpen(false);
          setDialog2Details(resp);
          setDialog2Open(true);
        }
      }
    };

    process();
  };

  const handleCopy = async (ref) => {
    if (ref.current) {
      try {
        // Extract text from the ref
        const textToCopy = ref.current.innerText;

        // Use the modern Clipboard API
        await navigator.clipboard.writeText(textToCopy);

        // Show success feedback
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }
  };

  if (status !== "authenticated") {
    return (
      <>
        <Hero title="Your Dashboard" imageUrl="/assets/dashboard.jpg" />
        <Container sx={{ px: { xs: 2, md: 0 }, mb: 4 }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  return (
    <>
      <Hero title="Your Dashboard" imageUrl="/assets/dashboard.jpg" />
      <Container sx={{ px: { xs: 2, md: 1, lg: 0 }, mb: 4 }}>
        <Typography variant="h4" gutterBottom={true} sx={{ mb: 2 }}>
          Manage Your Subscriptions
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Your API key
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          This API key proves who you are to our system and controls your access
          to all the services you have subscribed to. It is important that you
          keep this secret and never expose it to your end-users.
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          You can regenerate a new one at any time. Please note that the moment
          you regenerate the key, the old one will cease to work.
        </Typography>
        <Typography
          ref={apiKeyRef}
          variant="body1"
          sx={{
            p: 2,
            backgroundColor: "background.paper",
            border: "1px solid #E2E8F0",
            borderRadius: 1,
            fontFamily: "monospace",
            width: "100%",
            overflowWrap: "break-word", // Modern standard
            wordBreak: "break-word", // Compatibility fallback
          }}
        ></Typography>
        <Typography sx={{ mt: 2 }}>
          <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
            <Button
              component="span"
              variant="contained"
              sx={{ mr: 2 }}
              onClick={() => handleCopy(apiKeyRef)}
            >
              Copy API Key
            </Button>
          </Tooltip>
          <Button component="span" variant="outlined" onClick={openDialog}>
            Regenerate API Key
          </Button>
        </Typography>
      </Container>
      <Container sx={{ px: { xs: 2, md: 1, lg: 0 }, mb: 4 }}>
        <Typography variant="h5" gutterBottom={true} sx={{ mb: 2 }}>
          Subscriptions
        </Typography>
        {userData?.plans &&
          userData.plans.map((plan, index) => {
            return (
              <Plan key={`planholder_${index}`} index={index} plan={plan} />
            );
          })}
        {!userData?.plans && (
          <Typography variant="body" gutterBottom={true} sx={{ mb: 2 }}>
            You have not subscribed to any services yet.
          </Typography>
        )}
      </Container>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Regenerating API Key</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to do this? Your existing API key will stop
            working immediately.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Do not regenerate
          </Button>
          <Button onClick={handleRegenerate} variant="contained" autoFocus>
            Regenerate now
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={dialog2Open}
        onClose={handleClose2}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ color: dialog2Details?.success ? "darkgreen" : "darkred" }}
        >
          API Key
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialog2Details?.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
