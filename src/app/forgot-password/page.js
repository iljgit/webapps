"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Link,
  Paper,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data?.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setSent(true);
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
            <EmailOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5" mb={2}>
            Reset Password
          </Typography>

          {sent ? (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
              If an account exists with that email, a reset link has been sent.
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
                  label="Email Address"
                  type="email"
                  fullWidth
                  required
                  margin="normal"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Send Reset Link"}
                </Button>

                <Box textAlign="center">
                  <Typography variant="body2">
                    Remember your password?{" "}
                    <Link
                      component="button"
                      onClick={() => router.push("/login")}
                    >
                      Sign in
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
