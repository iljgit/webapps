"use client";
import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";

// Load the Inter font from Google via Next.js
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

let theme = createTheme({
  palette: {
    primary: {
      main: "#3B82F6",
      light: "#334155",
      dark: "#1d4585", //"#020617",
    },
    secondary: {
      main: "#3B82F6",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
      secondary: "#64748B",
    },
  },
});

theme = createTheme(theme, {
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: theme.palette.primary.main,
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
      color: theme.palette.primary.main,
    },
    h3: { fontWeight: 600, color: theme.palette.primary.main },
    h4: { fontWeight: 600, color: theme.palette.primary.main },
    h5: { fontWeight: 600, color: theme.palette.primary.main },
    h6: { fontWeight: 600, color: theme.palette.primary.main },
    button: { textTransform: "none", fontWeight: 600 }, // No all-caps buttons (modern style)
  },
  shape: {
    borderRadius: 8, // Slightly softer corners for a modern feel
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "8px 20px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
  },
});

export default theme;
