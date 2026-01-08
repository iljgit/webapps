import { Box, Typography, Container } from "@mui/material";

export default function Hero({ title, subtitle, imageUrl }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "300px",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        color: "white",
        mb: 4,
      }}
    >
      <Container sx={{ px: "0px !important" }}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        <Typography variant="h5">{subtitle}</Typography>
      </Container>
    </Box>
  );
}
