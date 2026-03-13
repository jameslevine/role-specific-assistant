import { Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";

import ImagePlaceholder from "../components/atoms/ImagePlaceholder";
import MarketingLayout from "../layouts/MarketingLayout";

const TEAM = [
  {
    name: "Alex Morgan",
    role: "CEO & Founder",
    bio: "Former electrical contractor with 15 years in the trade.",
  },
  { name: "Priya Sharma", role: "CTO", bio: "AI/ML engineer, previously at AWS and DeepMind." },
  {
    name: "Tom Williams",
    role: "Head of Content",
    bio: "Chartered engineer specialising in UK building regulations.",
  },
  {
    name: "Emma Clarke",
    role: "Head of Product",
    bio: "Product leader with experience at Monzo and Revolut.",
  },
];

const VALUES = [
  {
    title: "Accuracy First",
    description:
      "We never guess. Every response is grounded in verified UK regulations and standards.",
  },
  {
    title: "Built for the Trade",
    description:
      "We understand the realities of working on site. Our tools are practical, not academic.",
  },
  {
    title: "Continuous Improvement",
    description:
      "We update our knowledge base with every regulation amendment and industry change.",
  },
  {
    title: "Privacy by Design",
    description:
      "Your documents and conversations are encrypted and never shared with third parties.",
  },
];

const AboutPage = () => {
  return (
    <MarketingLayout>
      {/* Hero */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F8FAFC" }}>
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Typography variant="h2" fontWeight={800} sx={{ mb: 3 }}>
            About TradeAssist
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            fontWeight={400}
            sx={{ maxWidth: 700, mx: "auto", lineHeight: 1.7 }}
          >
            We are building the future of trade compliance. Our mission is to give every trade
            professional in the UK instant access to the regulatory guidance they need — powered by
            AI, grounded in real standards.
          </Typography>
        </Container>
      </Box>

      {/* Story */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h3" fontWeight={800} sx={{ mb: 3 }}>
                Our Story
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
                TradeAssist was born from a simple frustration: finding the right regulation at the
                right time shouldn't be this hard. Our founder, a former electrical contractor,
                spent years watching skilled professionals waste hours searching through manuals,
                calling helplines, and second-guessing compliance requirements.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
                In 2025, we combined deep trade expertise with cutting-edge AI to create something
                new: specialist AI assistants that truly understand each trade. Not generic chatbots
                — purpose-built tools trained on the specific regulations, standards, and best
                practices that matter to your profession.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Today, TradeAssist serves thousands of trade professionals across the UK, helping
                them work smarter, stay compliant, and focus on what they do best.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ImagePlaceholder height={400} label="Team Photo" borderRadius={3} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Values */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F8FAFC" }}>
        <Container maxWidth="xl">
          <Typography variant="h3" fontWeight={800} textAlign="center" sx={{ mb: 8 }}>
            Our Values
          </Typography>
          <Grid container spacing={4}>
            {VALUES.map((value, index) => (
              <Grid size={{ xs: 12, sm: 6 }} key={index}>
                <Card sx={{ height: "100%", p: 1 }}>
                  <CardContent>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <Typography variant="h3" fontWeight={800} textAlign="center" sx={{ mb: 8 }}>
            Meet the Team
          </Typography>
          <Grid container spacing={4}>
            {TEAM.map((member, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Box sx={{ textAlign: "center" }}>
                  <ImagePlaceholder height={200} label="Profile Photo" borderRadius={100} />
                  <Typography variant="h6" fontWeight={700} sx={{ mt: 2 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="primary.main" fontWeight={600}>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {member.bio}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </MarketingLayout>
  );
};

export default AboutPage;
