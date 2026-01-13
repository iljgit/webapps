"use client";

import React, { useState, useEffect } from "react";
import { Image } from "mui-image";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Container,
  Avatar,
  Tooltip,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();

  const handleLogin = () => {
    const scrollY = Math.floor(window.scrollY);

    // We embed the scroll position inside the callbackUrl itself
    const returnUrl = `${pathname}?restoreScroll=${scrollY}`;

    signIn(undefined, { callbackUrl: returnUrl });
    // 'undefined' triggers the default sign-in page, or pass your provider ID like 'google'
  };

  // State for menus
  const [anchorElNav, setAnchorElNav] = useState(null); // Mobile Hamburger
  const [anchorElServices, setAnchorElServices] = useState(null); // Services Submenu

  // Fix for Hydration errors: Only render dynamic content after mounting
  useEffect(() => {
    const mount = async () => {
      setMounted(true);
    };

    mount();
  }, []);

  // Handlers
  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenServices = (event) =>
    setAnchorElServices(event.currentTarget);
  const handleCloseServices = () => setAnchorElServices(null);

  // Loading Placeholder (prevents layout shift)
  if (!mounted) {
    return (
      <AppBar
        position="sticky"
        sx={{ bgcolor: "white", height: "64px", boxShadow: 1 }}
      />
    );
  }

  return (
    <AppBar position="sticky" sx={{ bgcolor: "white", boxShadow: 1 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* --- LOGO & STRAPLINE (Desktop) --- */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              mr: 4,
            }}
          >
            <Typography
              variant="h6"
              component={Link}
              href="/"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                textDecoration: "none",
              }}
            >
              <Image
                src="/assets/iseemyblue.png"
                alt="iSeeMy Logo"
                sx={{ my: 1, height: "40px !important" }}
              />
            </Typography>
            <Typography
              variant="caption"
              sx={{
                ml: 1,
                borderLeft: "1px solid #ccc",
                pl: 1,
                color: "text.secondary",
              }}
            >
              Innovative Web Applets
            </Typography>
          </Box>

          {/* --- MOBILE HAMBURGER MENU --- */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuItem onClick={handleCloseNavMenu} component={Link} href="/">
                Home
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleCloseNavMenu}
                component={Link}
                href="/ip"
              >
                IP Service
              </MenuItem>
              <MenuItem
                onClick={handleCloseNavMenu}
                component={Link}
                href="/about"
              >
                About
              </MenuItem>
            </Menu>
          </Box>

          {/* --- LOGO (Mobile) --- */}
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              fontWeight: "bold",
              color: "primary.main",
              textDecoration: "none",
            }}
          >
            {/* <Image
            src="/assets/iseemyblue.png"
            alt="iSeeMy Logo"
            sx={{
              my: 1,
              height: "40px !important",
              display: { xs: "flex", md: "none" },
            }}
          /> */}
          </Typography>

          {/* --- DESKTOP NAVIGATION --- */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              gap: 1,
            }}
          >
            <Button component={Link} href="/" sx={{ fontWeight: "800" }}>
              Home
            </Button>

            {/* Services Dropdown */}
            <Button
              sx={{}}
              endIcon={<KeyboardArrowDownIcon />}
              onClick={handleOpenServices}
            >
              Services
            </Button>
            <Menu
              anchorEl={anchorElServices}
              open={Boolean(anchorElServices)}
              onClose={handleCloseServices}
              disableScrollLock={true}
            >
              <MenuItem
                component={Link}
                href="/ip"
                onClick={handleCloseServices}
              >
                IP Service
              </MenuItem>
            </Menu>

            {session && (
              <Button component={Link} href="/dashboard" sx={{}}>
                Dashboard
              </Button>
            )}

            <Button component={Link} href="/about" sx={{}}>
              About
            </Button>
          </Box>

          {/* --- AUTH SECTION --- */}
          <Box sx={{ flexGrow: 0 }}>
            {status === "loading" ? (
              <Typography variant="caption" sx={{ color: "gray" }}>
                Checking...
              </Typography>
            ) : session ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Tooltip title={session.user.email}>
                  <Avatar
                    alt={session.user.name}
                    src={session.user.image}
                    sx={{ width: 35, height: 35, border: "1px solid #ddd" }}
                  />
                </Tooltip>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={handleLogin}
                sx={{ borderRadius: "20px", px: 3 }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
