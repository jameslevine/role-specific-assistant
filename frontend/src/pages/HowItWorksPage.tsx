import { Box, Button, Card, CardContent, Container, Grid, Typography } from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChatIcon from "@mui/icons-material/Chat";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import GavelIcon from "@mui/icons-material/Gavel";
import ImagePlaceholder from "../components/atoms/ImagePlaceholder";
import MarketingLayout from "../layouts/MarketingLayout";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useNavigate } from "react-router-dom";

const STEPS = [
  {
    number: "01",
    icon: <PersonSearchIcon sx={{ fontSize: 36 }} />,
    title: "Choose Your Trade Assistant",
    description:
      "Select from our range of specialist AI assistants. Each one is trained specifically for your trade with deep knowledge of the relevant UK regulations, standards, and best practices.",
    details: [
      "SparkAssist for Electricians",
      "PipeAssist for Plumbers",
      "BrickAssist for Bricklayers",
      "TimberAssist for Carpenters",
      "BrushAssist for Painters",
    ],
  },
  {
    number: "02",
    icon: <ChatIcon sx={{ fontSize: 36 }} />,
    title: "Ask Your Question",
    description:
      "Type your question in plain English — just like you would ask a colleague. No need for technical jargon or specific search terms. The AI understands context and trade-specific terminology.",
    details: [
      "Ask about specific regulations",
      "Get compliance guidance",
      "Request best practice advice",
      "Clarify testing procedures",
      "Understand certification requirements",
    ],
  },
  {
    number: "03",
    icon: <UploadFileIcon sx={{ fontSize: 36 }} />,
    title: "Upload Your Documents",
    description:
      "Make it personal. Upload your project specifications, customer files, or company procedures. The AI will use your documents as additional context when answering your questions.",
    details: [
      "PDF, DOCX, and TXT supported",
      "Project specifications",
      "Customer invoices and bills",
      "Company procedures",
      "Secure, encrypted storage",
    ],
  },
  {
    number: "04",
    icon: <GavelIcon sx={{ fontSize: 36 }} />,
    title: "Get Expert Guidance",
    description:
      "Receive detailed, regulation-grounded answers with citations to specific standards. Every response references the relevant BS, EN, or Building Regulation so you can verify and cite with confidence.",
    details: [
      "Specific regulation citations",
      "Step-by-step guidance",
      "Safety-critical warnings",
      "Links to source documents",
      "Conversation history saved",
    ],
  },
];

const HowItWorksPage = () => {
  const navigate = useNavigate();

  return (
    <MarketingLayout>
      {/* Hero */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F8FAFC" }}>
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Typography variant="h2" fontWeight={800} sx={{ mb: 2 }}>
            How TradeAssist Works
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            fontWeight={400}
            sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.7 }}
          >
            From question to answer in seconds. Here is how our AI-powered trade assistants help you
            work smarter and stay compliant.
          </Typography>
        </Container>
      </Box>

      {/* Steps */}
      <Box sx={{ py: { xs: 4, md: 8 } }}>
        <Container maxWidth="xl">
          {STEPS.map((step, index) => (
            <Grid
              container
              spacing={6}
              key={index}
              alignItems="center"
              sx={{ mb: { xs: 6, md: 10 } }}
              direction={index % 2 === 1 ? "row-reverse" : "row"}
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 800, color: "primary.main", opacity: 0.3 }}
                  >
                    {step.number}
                  </Typography>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: "primary.main",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {step.icon}
                  </Box>
                </Box>
                <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
                  {step.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>
                  {step.description}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {step.details.map((detail, i) => (
                    <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "success.main" }} />
                      <Typography variant="body2">{detail}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <ImagePlaceholder
                  height={350}
                  label={`Step ${step.number} — ${step.title}`}
                  borderRadius={3}
                />
              </Grid>
            </Grid>
          ))}
        </Container>
      </Box>

      {/* Use Cases */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F8FAFC" }}>
        <Container maxWidth="xl">
          <Typography variant="h3" fontWeight={800} textAlign="center" sx={{ mb: 2 }}>
            What Can You Ask?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            textAlign="center"
            fontWeight={400}
            sx={{ mb: 8, maxWidth: 600, mx: "auto" }}
          >
            Here are some examples of questions our trade assistants can help with.
          </Typography>
          <Grid container spacing={3}>
            {[
              "What are the maximum disconnection times for a 230V circuit under BS 7671?",
              "Do I need to notify Building Control for a consumer unit replacement?",
              "What are the COSHH requirements for lead paint removal?",
              "What mortar mix ratio should I use for a cavity wall below DPC?",
              "What are the minimum insulation resistance values for testing?",
              "Can I install an unvented hot water system without a G3 qualification?",
            ].map((question, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <ChatIcon sx={{ color: "primary.main", mb: 1 }} />
                    <Typography variant="body1" fontWeight={500} lineHeight={1.6}>
                      {question}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ py: { xs: 8, md: 12 }, textAlign: "center" }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>
            Ready to Try It?
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ mb: 4 }}>
            Start with 10 free questions per day. No credit card required.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/register")}
            sx={{ px: 4, py: 1.5, fontSize: "1rem" }}
          >
            Get Started Free
          </Button>
        </Container>
      </Box>
    </MarketingLayout>
  );
};

export default HowItWorksPage;
