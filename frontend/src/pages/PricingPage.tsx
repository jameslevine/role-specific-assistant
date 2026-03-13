import { Box, Button, Card, CardContent, Container, Grid, Typography } from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MarketingLayout from "../layouts/MarketingLayout";
import { TIER_PRICES } from "../constants";
import { useNavigate } from "react-router-dom";

const PLANS = [
  {
    tier: "Free",
    price: TIER_PRICES.free,
    period: "",
    description: "Perfect for trying out TradeAssist and occasional use.",
    features: [
      "10 questions per day",
      "5 document uploads",
      "Basic regulation guidance",
      "All 5 trade assistants",
      "Community support",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    tier: "Pro",
    price: TIER_PRICES.pro,
    period: "/month",
    description: "For professionals who need unlimited access every day.",
    features: [
      "Unlimited questions",
      "100 document uploads",
      "Full compliance access",
      "Priority response times",
      "Save and export conversations",
      "Document analysis",
      "Email support",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    tier: "Business",
    price: TIER_PRICES.business,
    period: "/month",
    description: "For teams and contractors managing multiple projects.",
    features: [
      "Everything in Pro",
      "500 document uploads",
      "Team accounts (up to 5 users)",
      "API access",
      "Compliance audit reports",
      "Custom document templates",
      "Dedicated account manager",
      "Phone support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const FAQ = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "The Free tier gives you 10 questions per day forever. You can upgrade to Pro when you need unlimited access.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards through our secure payment partner, Stripe.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes, you can cancel anytime. Your access continues until the end of your billing period.",
  },
  {
    q: "Do you offer discounts for annual billing?",
    a: "Annual billing with a 20% discount is coming soon. Contact us for early access.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. All data is encrypted at rest and in transit using AWS infrastructure. Your documents are only accessible to you.",
  },
];

const PricingPage = () => {
  const navigate = useNavigate();

  return (
    <MarketingLayout>
      {/* Hero */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F8FAFC" }}>
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Typography variant="h2" fontWeight={800} sx={{ mb: 2 }}>
            Simple, Transparent Pricing
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            fontWeight={400}
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Start free, upgrade when you need more. No hidden fees, no long-term contracts.
          </Typography>
        </Container>
      </Box>

      {/* Plans */}
      <Box sx={{ py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {PLANS.map((plan) => (
              <Grid size={{ xs: 12, md: 4 }} key={plan.tier}>
                <Card
                  sx={{
                    height: "100%",
                    border: plan.highlighted ? "2px solid" : "1px solid",
                    borderColor: plan.highlighted ? "primary.main" : "divider",
                    position: "relative",
                    transform: plan.highlighted ? { md: "scale(1.05)" } : undefined,
                    zIndex: plan.highlighted ? 1 : 0,
                  }}
                >
                  {plan.highlighted && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bgcolor: "primary.main",
                        color: "white",
                        textAlign: "center",
                        py: 0.5,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                      }}
                    >
                      Most Popular
                    </Box>
                  )}
                  <CardContent sx={{ p: 4, pt: plan.highlighted ? 5 : 4 }}>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                      {plan.tier}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3, minHeight: 40 }}
                    >
                      {plan.description}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "baseline", mb: 3 }}>
                      <Typography variant="h3" fontWeight={800}>
                        {plan.price}
                      </Typography>
                      {plan.period && (
                        <Typography variant="body1" color="text.secondary" sx={{ ml: 0.5 }}>
                          {plan.period}
                        </Typography>
                      )}
                    </Box>
                    <Button
                      fullWidth
                      variant={plan.highlighted ? "contained" : "outlined"}
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate("/register")}
                      sx={{ mb: 3, py: 1.5 }}
                    >
                      {plan.cta}
                    </Button>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      {plan.features.map((feature, i) => (
                        <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                          <CheckCircleOutlineIcon
                            sx={{ fontSize: 20, color: "success.main", mt: 0.2 }}
                          />
                          <Typography variant="body2">{feature}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F8FAFC" }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={800} textAlign="center" sx={{ mb: 8 }}>
            Frequently Asked Questions
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {FAQ.map((item, index) => (
              <Card key={index}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                    {item.q}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                    {item.a}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
    </MarketingLayout>
  );
};

export default PricingPage;
