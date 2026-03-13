import { Box, Button, Card, CardContent, Chip, Container, Grid, Typography } from "@mui/material";
import { ROLE_BRANDS, TIER_PRICES } from "../constants";
import { useNavigate, useParams } from "react-router-dom";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ChatIcon from "@mui/icons-material/Chat";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GavelIcon from "@mui/icons-material/Gavel";
import MarketingLayout from "../layouts/MarketingLayout";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useAuth } from "../hooks/useAuth";

const RoleLandingPage = () => {
  const { roleSlug = "" } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const brand = ROLE_BRANDS[roleSlug];

  if (!brand) {
    return (
      <MarketingLayout>
        <Container maxWidth="sm" sx={{ textAlign: "center", py: 10 }}>
          <Typography variant="h4" sx={{ mt: 2 }}>
            Role not found
          </Typography>
          <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>
            View All Assistants
          </Button>
        </Container>
      </MarketingLayout>
    );
  }

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(`/${roleSlug}/chat`);
    } else {
      navigate("/register");
    }
  };

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${brand.color}15 0%, ${brand.color}05 100%)`,
          borderBottom: `3px solid ${brand.color}20`,
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}
          >
            <Button onClick={() => navigate("/")} sx={{ color: "text.secondary" }}>
              ← All Assistants
            </Button>
            {isAuthenticated ? (
              <Button variant="outlined" onClick={() => navigate(`/${roleSlug}/chat`)}>
                Open Chat
              </Button>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button onClick={() => navigate("/login")}>Sign In</Button>
                <Button
                  variant="contained"
                  sx={{ bgcolor: brand.color }}
                  onClick={() => navigate("/register")}
                >
                  Get Started Free
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto" }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 3,
                bgcolor: `${brand.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 40, color: brand.color }} />
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: brand.color,
                fontSize: { xs: "2rem", md: "3.5rem" },
                mb: 2,
              }}
            >
              {brand.name}
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
              {brand.tagline}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 600, mx: "auto", lineHeight: 1.8 }}
            >
              Your AI-powered assistant for {roleSlug}s working in the UK. Get instant,
              regulation-grounded answers to your professional questions — from compliance queries
              to best practice guidance.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ChatIcon />}
                onClick={handleGetStarted}
                sx={{
                  bgcolor: brand.color,
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  "&:hover": { bgcolor: brand.color, opacity: 0.9 },
                }}
              >
                {isAuthenticated ? "Start Chatting" : "Get Started Free"}
              </Button>
              <Chip
                label="No credit card required"
                variant="outlined"
                sx={{ alignSelf: "center" }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" fontWeight={700} sx={{ mb: 1 }}>
          What {brand.name} Can Do
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 6, maxWidth: 600, mx: "auto" }}
        >
          Powered by AI and grounded in the latest UK regulations and standards
        </Typography>

        <Grid container spacing={3}>
          {[
            {
              icon: <GavelIcon sx={{ fontSize: 40, color: brand.color }} />,
              title: "Regulation Guidance",
              description:
                "Get instant answers grounded in current UK regulations and British Standards. Every response cites the specific regulation.",
            },
            {
              icon: <ChatIcon sx={{ fontSize: 40, color: brand.color }} />,
              title: "Expert Chat",
              description:
                "Ask questions in plain English and get clear, professional answers. Like having an expert colleague available 24/7.",
            },
            {
              icon: <UploadFileIcon sx={{ fontSize: 40, color: brand.color }} />,
              title: "Document Analysis",
              description:
                "Upload your own documents — project specs, customer bills, company procedures — and get AI assistance tailored to your work.",
            },
            {
              icon: <CheckCircleIcon sx={{ fontSize: 40, color: brand.color }} />,
              title: "Compliance Checks",
              description:
                "Verify your work meets current standards. Get guidance on inspection requirements, testing procedures, and certification.",
            },
          ].map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card sx={{ height: "100%", textAlign: "center", p: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box sx={{ bgcolor: "grey.50", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" fontWeight={700} sx={{ mb: 1 }}>
            Simple Pricing
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
            Start free, upgrade when you need more
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {[
              {
                tier: "Free",
                price: TIER_PRICES.free,
                features: [
                  "10 questions per day",
                  "5 document uploads",
                  "Basic regulation guidance",
                  "Community support",
                ],
                cta: "Get Started Free",
                highlighted: false,
              },
              {
                tier: "Pro",
                price: TIER_PRICES.pro,
                features: [
                  "Unlimited questions",
                  "100 document uploads",
                  "Full compliance access",
                  "Priority responses",
                  "Save & export chats",
                ],
                cta: "Start Pro Trial",
                highlighted: true,
              },
              {
                tier: "Business",
                price: TIER_PRICES.business,
                features: [
                  "Everything in Pro",
                  "500 document uploads",
                  "Team accounts (5 users)",
                  "API access",
                  "Compliance audit reports",
                ],
                cta: "Contact Sales",
                highlighted: false,
              },
            ].map((plan, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    border: plan.highlighted ? `2px solid ${brand.color}` : undefined,
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
                      {plan.tier}
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
                    <Button
                      fullWidth
                      variant={plan.highlighted ? "contained" : "outlined"}
                      onClick={handleGetStarted}
                      sx={
                        plan.highlighted
                          ? {
                              bgcolor: brand.color,
                              "&:hover": { bgcolor: brand.color, opacity: 0.9 },
                            }
                          : {}
                      }
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer CTA */}
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
            Ready to get started?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Join thousands of {roleSlug}s using {brand.name} to work smarter and stay compliant.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              bgcolor: brand.color,
              px: 4,
              py: 1.5,
              "&:hover": { bgcolor: brand.color, opacity: 0.9 },
            }}
          >
            {isAuthenticated ? "Open Chat" : "Create Free Account"}
          </Button>
        </Container>
      </Box>
    </MarketingLayout>
  );
};

export default RoleLandingPage;
