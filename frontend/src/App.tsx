import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AboutPage from "./pages/AboutPage";
import BillingPage from "./pages/BillingPage";
import ChatPage from "./pages/ChatPage";
import DocumentsPage from "./pages/DocumentsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import HowItWorksPage from "./pages/HowItWorksPage";
import LoginPage from "./pages/LoginPage";
import PricingPage from "./pages/PricingPage";
import ProtectedRoute from "./components/atoms/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import RoleLandingPage from "./pages/RoleLandingPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import { defaultTheme } from "./styles/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Marketing pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />

            {/* Auth pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Role landing pages */}
            <Route path="/:roleSlug" element={<RoleLandingPage />} />

            {/* Protected app routes */}
            <Route
              path="/:roleSlug/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/:roleSlug/chat/:conversationId"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/:roleSlug/documents"
              element={
                <ProtectedRoute>
                  <DocumentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/:roleSlug/billing"
              element={
                <ProtectedRoute>
                  <BillingPage />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div style={{ padding: "4rem", textAlign: "center" }}>
                  <h1>Page Not Found</h1>
                  <p style={{ color: "#64748b", marginTop: "1rem" }}>
                    The page you are looking for does not exist.
                  </p>
                  <a
                    href="/"
                    style={{ color: "#2563EB", marginTop: "1rem", display: "inline-block" }}
                  >
                    Return to Home
                  </a>
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
