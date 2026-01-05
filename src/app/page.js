import { Container, Typography, Grid } from "@mui/material";
import Hero from "@/components/Hero";
import ActionCard from "@/components/ActionCard";

const services = [
  {
    title: "IP Service",
    body: "Identify your public IP address quickly and easily.",
    imageUrl: "/assets/ip.jpg",
    href: "/ip",
    ctaText: "Try it Now...",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero
        title="iSeeMy Portal"
        subtitle="UK-based specialised web applets for global users."
        imageUrl="/assets/home.jpg"
      />
      <Container sx={{ px: { xs: 2, md: 0 } }}>
        <Typography variant="h4" gutterBottom>
          Our Focus
        </Typography>
        <Typography variant="body1">
          We provide high-performance, subscription-based tools for developers
          of advanced web sites.
        </Typography>
      </Container>
      <Container sx={{ mt: 2, px: { xs: 2, md: 0 } }}>
        <Grid container sx={{ px: { xs: 2, md: 0 } }}>
          {services.map((service, index) => {
            return (
              <Grid key={`service_${index}`} size={{ xs: 12, md: 4, lg: 3 }}>
                <ActionCard
                  title={service.title}
                  body={service.body}
                  imageUrl={service.imageUrl}
                  href={service.href}
                  ctaText={service.ctaText}
                />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
}
