"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token"); // ?token=...

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ mt: 10, p: 4 }}>
          <Typography variant="h6" color="error">
            Invalid reset link.
          </Typography>
        </Paper>
      </Container>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to reset password");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 10, p: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ mb: 1, bgcolor: "primary.main" }}>
            <LockResetOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5" mb={2}>
            Reset Password
          </Typography>

          {success ? (
            <Alert severity="success" sx={{ width: "100%" }}>
              Your password has been reset! You can now{" "}
              <Button variant="text" onClick={() => router.push("/login")}>
                sign in
              </Button>
            </Alert>
          ) : (
            <>
              {error && (
                <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: "100%" }}
              >
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  required
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  helperText="At least 8 characters"
                />

                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  required
                  margin="normal"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Reset Password"}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
