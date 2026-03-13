import { Box, Button, Card, CardContent, Container, Grid, Typography } from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ChatIcon from "@mui/icons-material/Chat";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import GavelIcon from "@mui/icons-material/Gavel";
import ImagePlaceholder from "../components/atoms/ImagePlaceholder";
import MarketingLayout from "../layouts/MarketingLayout";
import { ROLE_BRANDS } from "../constants";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: <GavelIcon sx={{ fontSize: 32 }} />,
    title: "Regulation Grounded",
    description:
      "Every response is backed by current UK regulations and British Standards. No guesswork — just accurate, citable guidance.",
  },
  {
    icon: <ChatIcon sx={{ fontSize: 32 }} />,
    title: "Natural Conversation",
    description:
      "Ask questions in plain English. Get clear, professional answers as if you had an expert colleague available 24/7.",
  },
  {
    icon: <UploadFileIcon sx={{ fontSize: 32 }} />,
    title: "Your Documents, Your Context",
    description:
      "Upload project specs, customer files, or company procedures. The AI uses your documents to give personalised answers.",
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 32 }} />,
    title: "Instant Answers",
    description:
      "No more searching through manuals or waiting for callbacks. Get the guidance you need in seconds, not hours.",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 32 }} />,
    title: "Secure & Private",
    description:
      "Your data is encrypted at rest and in transit. Documents are stored securely and only accessible to you.",
  },
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 32 }} />,
    title: "Always Up to Date",
    description:
      "Our knowledge base is continuously updated with the latest regulation amendments and industry guidance.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose Your Trade",
    description:
      "Select from our range of specialist AI assistants, each trained for a specific trade.",
  },
  {
    step: "02",
    title: "Ask Your Question",
    description:
      "Type your question in plain English — about regulations, best practices, or compliance.",
  },
  {
    step: "03",
    title: "Get Expert Guidance",
    description:
      "Receive detailed, regulation-grounded answers with citations to specific standards.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "SparkAssist has completely changed how I handle regulation queries on site. It's like having the 18th Edition in my pocket, but smarter.",
    name: "David Thompson",
    role: "Electrician, London",
  },
  {
    quote:
      "I used to spend hours looking up Part P requirements. Now I get accurate answers in seconds. Worth every penny.",
    name: "Sarah Mitchell",
    role: "Electrical Contractor, Manchester",
  },
  {
    quote:
      "The document upload feature is brilliant. I uploaded my project specs and the AI gives me tailored compliance advice.",
    name: "James O'Brien",
    role: "Site Manager, Birmingham",
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 50%, #F8FAFC 100%)",
          py: { xs: 8, md: 14 },
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mb: 3,
                  color: "#0F172A",
                }}
              >
                AI-Powered Assistants for{" "}
                <Box component="span" sx={{ color: "primary.main" }}>
                  Trade Professionals
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "text.secondary",
                  fontWeight: 400,
                  lineHeight: 1.7,
                  mb: 4,
                  maxWidth: 520,
                }}
              >
                Get instant, regulation-grounded guidance for your trade. From compliance queries to
                best practice advice — powered by AI, backed by UK standards.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/register")}
                  sx={{ px: 4, py: 1.5, fontSize: "1rem" }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/how-it-works")}
                  sx={{ px: 4, py: 1.5, fontSize: "1rem" }}
                >
                  See How It Works
                </Button>
              </Box>
              <Box sx={{ display: "flex", gap: 3, mt: 4, flexWrap: "wrap" }}>
                {["No credit card required", "10 free questions daily", "Cancel anytime"].map(
                  (text) => (
                    <Box key={text} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "success.main" }} />
                      <Typography variant="body2" color="text.secondary">
                        {text}
                      </Typography>
                    </Box>
                  ),
                )}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ImagePlaceholder
                height={450}
                label="Hero Image — AI Chat Interface"
                borderRadius={3}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Trusted By / Social Proof */}
      <Box sx={{ py: 6, borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            Trusted by trade professionals across the UK
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: { xs: 4, md: 8 },
              flexWrap: "wrap",
              opacity: 0.5,
            }}
          >
            {["NICEIC", "NAPIT", "ECA", "Gas Safe", "CITB"].map((name) => (
              <Typography key={name} variant="h6" fontWeight={700} color="text.secondary">
                {name}
              </Typography>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Role Cards */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>
              Choose Your Specialist Assistant
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              fontWeight={400}
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Each assistant is trained specifically for your trade, with deep knowledge of the
              relevant UK regulations and standards.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {Object.entries(ROLE_BRANDS).map(([slug, brand]) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={slug}>
                <Card
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    border: "2px solid transparent",
                    "&:hover": {
                      borderColor: brand.color,
                      transform: "translateY(-4px)",
                      boxShadow: `0 8px 24px ${brand.color}20`,
                    },
                  }}
                  onClick={() => navigate(`/${slug}`)}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: `${brand.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <AutoAwesomeIcon sx={{ color: brand.color, fontSize: 28 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: brand.color, mb: 0.5 }}>
                      {brand.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textTransform: "capitalize" }}
                    >
                      For {slug}s
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F8FAFC" }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>
              Everything You Need
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              fontWeight={400}
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Built specifically for UK trade professionals who need fast, accurate regulatory
              guidance.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {FEATURES.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card sx={{ height: "100%", p: 1 }}>
                  <CardContent>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: "primary.main",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>
              How It Works
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={400}>
              Get started in under a minute
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {HOW_IT_WORKS.map((item, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h2"
                    sx={{ fontWeight: 800, color: "primary.main", opacity: 0.2, mb: 1 }}
                  >
                    {item.step}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                    {item.description}
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <ImagePlaceholder height={200} label={`Step ${item.step} Illustration`} />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F8FAFC" }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>
              What Professionals Say
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {TESTIMONIALS.map((testimonial, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card sx={{ height: "100%", p: 1 }}>
                  <CardContent>
                    <Typography
                      variant="body1"
                      sx={{ fontStyle: "italic", lineHeight: 1.8, mb: 3, color: "text.secondary" }}
                    >
                      &ldquo;{testimonial.quote}&rdquo;
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          bgcolor: "grey.200",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="body2" fontWeight={700} color="text.secondary">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={700}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)",
          color: "white",
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>
            Ready to Work Smarter?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
            Join thousands of trade professionals using TradeAssist to stay compliant and work more
            efficiently.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/register")}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                bgcolor: "white",
                color: "primary.main",
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/pricing")}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                borderColor: "rgba(255,255,255,0.5)",
                color: "white",
                "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              View Pricing
            </Button>
          </Box>
        </Container>
      </Box>
    </MarketingLayout>
  );
};

export default HomePage;
