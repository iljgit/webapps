import { Container, Typography, Grid } from "@mui/material";
import Hero from "@/components/Hero";
import ActionCard from "@/components/ActionCard";

const services = [
  {
    title: "IP Decoder",
    body: "Find out where an ip address comes from quickly and easily",
    imageUrl: "/assets/ip.jpg",
    href: "/ip",
    ctaText: "Try it Now...",
  },
  {
    title: "Email Verifier",
    body: "Check that an email address is valid and can receive mail in near real-time",
    imageUrl: "/assets/email.jpg",
    href: "/email",
    ctaText: "Try it Now...",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero
        title="iSeeMy Portal"
        subtitle="UK-based specialised web applets for global users"
        imageUrl="/assets/home.jpg"
      />
      <Container sx={{ px: { xs: 2, md: 0 } }}>
        <Typography variant="h4" gutterBottom={true}>
          Our Focus
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          iSeeMy was created in response to a demand from our customers to make
          our API services easily available to integrate with popular CMSs and
          their own servers.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          We are in the process of creating a library of AI-enabled services
          which you can deploy easily and for low, understandable costs.
        </Typography>
      </Container>
      <Container sx={{ my: 2, px: { xs: 2, md: 0 } }}>
        <Grid container sx={{ px: { xs: 2, md: 0 } }}>
          {services.map((service, index) => {
            return (
              <Grid
                key={`service_${index}`}
                size={{ xs: 12, md: 4, lg: 3 }}
                sx={{ display: "flex", justifyContent: "center", p: 2 }}
              >
                <ActionCard
                  title={service.title}
                  body={service.body}
                  imageUrl={service.imageUrl}
                  href={service.href}
                  ctaText={service.ctaText}
                  boxShadow={3}
                />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
}
