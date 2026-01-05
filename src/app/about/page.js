import { Container, Typography } from "@mui/material";
import Hero from "@/components/Hero";

export const metadata = {
  title: "iSeeMy: About Us",
  description: "UK-based Web Applet Portal",
};

export default function AboutPage() {
  return (
    <>
      <Hero
        title="About Us"
        subtitle="Software development from the heart of the UK."
        imageUrl="/assets/about.jpg"
      />
      <Container>
        <Typography variant="body1">
          We specialize in micro-SaaS solutions. All our applets are hosted on
          Google Cloud for 99.9% uptime.
        </Typography>
      </Container>
    </>
  );
}
