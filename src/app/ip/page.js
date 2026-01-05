import { headers } from "next/headers";
import { Container, Typography, Paper } from "@mui/material";
import Hero from "@/components/Hero";

export default async function IPPage() {
  const headerStack = await headers();
  const ip = headerStack.get("x-forwarded-for") || "127.0.0.1";

  return (
    <>
      <Hero
        title="IP Service"
        subtitle="Identify your connection details."
        imageUrl="/assets/ip.jpg"
      />
      <Container>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5">Your Public IP Address is:</Typography>
          <Typography variant="h2" color="primary" sx={{ mt: 2 }}>
            {ip.split(",")[0]}
          </Typography>
        </Paper>
      </Container>
    </>
  );
}
