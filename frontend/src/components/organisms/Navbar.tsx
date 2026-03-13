import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

const NAV_LINKS = [
  { label: "How It Works", path: "/how-it-works" },
  { label: "Pricing", path: "/pricing" },
  { label: "About", path: "/about" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 72 }}>
            {/* Logo */}
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 800,
                color: "primary.main",
                textDecoration: "none",
                letterSpacing: "-0.5px",
                mr: 4,
              }}
            >
              TradeAssist
            </Typography>

            {/* Desktop Nav Links */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
                {NAV_LINKS.map((link) => (
                  <Button
                    key={link.path}
                    component={RouterLink}
                    to={link.path}
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      "&:hover": { color: "text.primary", bgcolor: "transparent" },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Desktop Auth Buttons */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate("/electrician/chat")}
                    >
                      Dashboard
                    </Button>
                    <Button size="small" onClick={logout} sx={{ color: "text.secondary" }}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => navigate("/login")}
                      sx={{ color: "text.secondary", fontWeight: 500 }}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => navigate("/register")}
                      sx={{ borderRadius: 2, px: 3 }}
                    >
                      Get Started Free
                    </Button>
                  </>
                )}
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <Box sx={{ ml: "auto" }}>
                <IconButton onClick={() => setMobileOpen(true)}>
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight={700} color="primary">
            TradeAssist
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {NAV_LINKS.map((link) => (
            <ListItemButton
              key={link.path}
              onClick={() => {
                navigate(link.path);
                setMobileOpen(false);
              }}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          {isAuthenticated ? (
            <>
              <Button variant="outlined" fullWidth onClick={() => navigate("/electrician/chat")}>
                Dashboard
              </Button>
              <Button fullWidth onClick={logout}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outlined" fullWidth onClick={() => navigate("/login")}>
                Sign In
              </Button>
              <Button variant="contained" fullWidth onClick={() => navigate("/register")}>
                Get Started Free
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
