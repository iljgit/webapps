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

export default function DashboardPage() {
  const apiKeyRef = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { status } = useSession();

  useEffect(() => {
    // Fetch the API key from the server when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/userdata");
        if (response.ok) {
          const data = await response.json();
          const user = data.user;

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
  }, [status]);

  if (status !== "authenticated") {
    return redirect("/api/auth/signin");
  }

  const handleClose = () => {
    setDialogOpen(false);
  };

  const openDialog = () => {
    setDialogOpen(true);
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

  return (
    <>
      <Hero title="Your Dashboard" imageUrl="/assets/dashboard.jpg" />
      <Container sx={{ px: { xs: 2, md: 0 }, mb: 4 }}>
        <Typography variant="h4" gutterBottom={true} sx={{ mb: 2 }}>
          Manage Your Subscriptions
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
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
          <Button onClick={handleClose} variant="contained" autoFocus>
            Regenerate now
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
