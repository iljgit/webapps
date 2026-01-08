import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Container, Typography, Paper, Button, Box } from "@mui/material";
import Hero from "@/components/Hero";
import Link from "next/link";

export default async function DashboardPage() {
  // 1. Check if the user is logged in on the server
  const session = await getServerSession();

  // 2. If no session exists, redirect to the login page
  if (!session) {
    redirect("/api/auth/signin");
    // Or you could return a custom "Please Login" UI instead of redirecting
  }

  const headerStack = await headers();
  const ip = headerStack.get("x-forwarded-for") || "127.0.0.1";

  return (
    <>
      <Hero title="Your Dashboard" imageUrl="/assets/dashboard.jpg" />
      <Container>
        <Paper
          elevation={3}
          sx={{ p: 4, textAlign: "center", border: "1px solid #e0e0e0" }}
        >
          <Typography variant="h5">Manage your subscriptions</Typography>
        </Paper>
      </Container>
    </>
  );
}
