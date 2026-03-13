import { Box, Container, Grid, Link, Typography } from "@mui/material";

import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0F172A",
        color: "white",
        py: 8,
        mt: "auto",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
              TradeAssist
            </Typography>
            <Typography variant="body2" sx={{ color: "grey.400", maxWidth: 300, lineHeight: 1.8 }}>
              AI-powered assistants for trade professionals. Get instant, regulation-grounded
              guidance for your trade — from compliance queries to best practice advice.
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: "grey.300" }}>
              Product
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                component={RouterLink}
                to="/how-it-works"
                color="grey.400"
                underline="hover"
                variant="body2"
              >
                How It Works
              </Link>
              <Link
                component={RouterLink}
                to="/pricing"
                color="grey.400"
                underline="hover"
                variant="body2"
              >
                Pricing
              </Link>
              <Link
                component={RouterLink}
                to="/electrician"
                color="grey.400"
                underline="hover"
                variant="body2"
              >
                SparkAssist
              </Link>
              <Link
                component={RouterLink}
                to="/plumber"
                color="grey.400"
                underline="hover"
                variant="body2"
              >
                PipeAssist
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: "grey.300" }}>
              Company
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                component={RouterLink}
                to="/about"
                color="grey.400"
                underline="hover"
                variant="body2"
              >
                About Us
              </Link>
              <Link href="#" color="grey.400" underline="hover" variant="body2">
                Blog
              </Link>
              <Link href="#" color="grey.400" underline="hover" variant="body2">
                Careers
              </Link>
              <Link href="#" color="grey.400" underline="hover" variant="body2">
                Contact
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: "grey.300" }}>
              Stay Updated
            </Typography>
            <Typography variant="body2" sx={{ color: "grey.400", mb: 2 }}>
              Subscribe to our newsletter for the latest updates on new roles and features.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Box
                component="input"
                placeholder="Enter your email"
                sx={{
                  flex: 1,
                  px: 2,
                  py: 1.5,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "grey.700",
                  bgcolor: "grey.900",
                  color: "white",
                  fontSize: "0.875rem",
                  outline: "none",
                  "&:focus": { borderColor: "primary.main" },
                }}
              />
              <Box
                component="button"
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 1,
                  border: "none",
                  bgcolor: "primary.main",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                Subscribe
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 6,
            pt: 4,
            borderTop: "1px solid",
            borderColor: "grey.800",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="grey.500">
            &copy; {new Date().getFullYear()} TradeAssist. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Link href="#" color="grey.500" underline="hover" variant="body2">
              Privacy Policy
            </Link>
            <Link href="#" color="grey.500" underline="hover" variant="body2">
              Terms of Service
            </Link>
            <Link href="#" color="grey.500" underline="hover" variant="body2">
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
