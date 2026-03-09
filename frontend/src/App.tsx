import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ChatPage from "./pages/ChatPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/atoms/ProtectedRoute";
import { ROLE_BRANDS } from "./constants";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import { defaultTheme } from "./styles/theme";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// Home page — shows all available role assistants
const HomePage = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div style={{ padding: "2rem", textAlign: "center", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ margin: 0 }}>🏗️ TradeAssist</h1>
        {isAuthenticated ? (
          <button onClick={logout} style={{ padding: "8px 16px", cursor: "pointer" }}>
            Sign Out
          </button>
        ) : (
          <a href="/login" style={{ padding: "8px 16px", textDecoration: "none" }}>
            Sign In
          </a>
        )}
      </div>
      <p style={{ fontSize: "1.25rem", color: "#64748b", marginBottom: "2rem" }}>
        AI-Powered Assistants for Trade Professionals
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        {Object.entries(ROLE_BRANDS).map(([slug, brand]) => (
          <a
            key={slug}
            href={`/${slug}`}
            style={{
              padding: "2rem 1.5rem",
              border: "2px solid #e2e8f0",
              borderRadius: "16px",
              textDecoration: "none",
              color: "inherit",
              transition: "all 0.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div style={{ fontSize: "3rem" }}>{brand.icon}</div>
            <h3 style={{ margin: 0, color: brand.color }}>{brand.name}</h3>
            <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>{brand.tagline}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

// Placeholder page for landing — will be fully implemented next
const RoleLandingPage = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>Role Landing Page</h1>
    <p>Dynamic role-specific landing page with branding — coming next.</p>
    <a href="/">← Back to Home</a>
  </div>
);

const NotFoundPage = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>404 — Page Not Found</h1>
    <a href="/">Go Home</a>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/:roleSlug" element={<RoleLandingPage />} />

            {/* Protected routes */}
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

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
