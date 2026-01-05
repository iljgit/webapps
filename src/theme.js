"use client";
import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";

// Load the Inter font from Google via Next.js
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#0F172A", // Deep Slate
      light: "#334155",
      dark: "#020617",
    },
    secondary: {
      main: "#3B82F6", // Electric Blue
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
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.01em" },
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
