"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import theme from "@/theme"; // Import your new theme

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/* MOVE THE LAYOUT DIV INSIDE HERE */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Navbar />
            <main style={{ flexGrow: 1 }}>{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </SessionProvider>
  );
}
