import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { ROLE_BRANDS, TIER_PRICES } from "../constants";
import { useNavigate, useParams } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { apiClient } from "../services/apiClient";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useStore } from "../store";

const BillingPage = () => {
  const { roleSlug = "" } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = useStore((state) => state.user);
  const [loading, setLoading] = useState<string | null>(null);

  const brand = ROLE_BRANDS[roleSlug] || { name: "TradeAssist", icon: "🏗️", color: "#2563EB" };
  const currentTier = user?.tier || "free";

  const handleUpgrade = async (tier: string) => {
    setLoading(tier);
    try {
      const response = await apiClient.post<{ checkoutUrl: string }>("/subscriptions/checkout", {
        tier,
        successUrl: `${window.location.origin}/${roleSlug}/chat?upgraded=true`,
        cancelUrl: `${window.location.origin}/${roleSlug}/billing?cancelled=true`,
      });
      window.location.assign(response.checkoutUrl);
    } catch (err) {
      console.error("Failed to create checkout session:", err);
      setLoading(null);
    }
  };

  const handleManageBilling = async () => {
    setLoading("portal");
    try {
      const response = await apiClient.post<{ portalUrl: string }>("/subscriptions/portal");
      window.location.assign(response.portalUrl);
    } catch (err) {
      console.error("Failed to create portal session:", err);
      setLoading(null);
    }
  };

  const plans = [
    {
      tier: "free",
      name: "Free",
      price: TIER_PRICES.free,
      period: "",
      features: [
        "10 questions per day",
        "5 document uploads",
        "Basic regulation guidance",
        "Community support",
      ],
    },
    {
      tier: "pro",
      name: "Pro",
      price: TIER_PRICES.pro,
      period: "/month",
      features: [
        "Unlimited questions",
        "100 document uploads",
        "Full compliance access",
        "Priority responses",
        "Save & export chats",
      ],
      highlighted: true,
    },
    {
      tier: "business",
      name: "Business",
      price: TIER_PRICES.business,
      period: "/month",
      features: [
        "Everything in Pro",
        "500 document uploads",
        "Team accounts (5 users)",
        "API access",
        "Compliance audit reports",
      ],
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate(`/${roleSlug}/chat`)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {brand.icon} {brand.name} — Billing
          </Typography>
          <Button size="small" onClick={logout}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Current Plan */}
        <Card sx={{ mb: 4, bgcolor: `${brand.color}08`, border: `1px solid ${brand.color}30` }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h6" fontWeight={600}>
              Current Plan
            </Typography>
            <Chip
              label={currentTier.toUpperCase()}
              sx={{
                mt: 1,
                bgcolor: brand.color,
                color: "white",
                fontWeight: 700,
                fontSize: "1rem",
                px: 2,
                py: 0.5,
              }}
            />
            {currentTier !== "free" && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleManageBilling}
                  disabled={loading === "portal"}
                >
                  {loading === "portal" ? "Loading..." : "Manage Billing"}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Plans */}
        <Typography variant="h4" textAlign="center" fontWeight={700} sx={{ mb: 1 }}>
          Choose Your Plan
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
          Upgrade to unlock unlimited questions and more document storage
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {plans.map((plan) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plan.tier}>
              <Card
                sx={{
                  height: "100%",
                  border: plan.highlighted
                    ? `2px solid ${brand.color}`
                    : currentTier === plan.tier
                      ? `2px solid ${brand.color}50`
                      : undefined,
                  position: "relative",
                }}
              >
                {plan.highlighted && (
                  <Chip
                    label="Most Popular"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      bgcolor: brand.color,
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                )}
                <CardContent sx={{ textAlign: "center", p: 4 }}>
                  <Typography variant="h5" fontWeight={600}>
                    {plan.name}
                  </Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ my: 2, color: brand.color }}>
                    {plan.price}
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {plan.features.map((feature, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                          justifyContent: "center",
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 18, color: "success.main" }} />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                  </Box>
                  {currentTier === plan.tier ? (
                    <Button fullWidth variant="outlined" disabled>
                      Current Plan
                    </Button>
                  ) : plan.tier === "free" ? (
                    <Button fullWidth variant="outlined" disabled>
                      Free Forever
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant={plan.highlighted ? "contained" : "outlined"}
                      onClick={() => handleUpgrade(plan.tier)}
                      disabled={loading === plan.tier}
                      sx={
                        plan.highlighted
                          ? {
                              bgcolor: brand.color,
                              "&:hover": { bgcolor: brand.color, opacity: 0.9 },
                            }
                          : {}
                      }
                    >
                      {loading === plan.tier ? "Loading..." : `Upgrade to ${plan.name}`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default BillingPage;
