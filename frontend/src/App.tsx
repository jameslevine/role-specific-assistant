import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { defaultTheme } from "./styles/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// Placeholder pages — will be replaced with actual implementations
const HomePage = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>🏗️ TradeAssist</h1>
    <p>AI-Powered Assistants for Trade Professionals</p>
    <div
      style={{
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        flexWrap: "wrap",
        marginTop: "2rem",
      }}
    >
      {[
        { slug: "electrician", name: "SparkAssist", icon: "⚡" },
        { slug: "plumber", name: "PipeAssist", icon: "🔧" },
        { slug: "bricklayer", name: "BrickAssist", icon: "🧱" },
        { slug: "carpenter", name: "TimberAssist", icon: "🪚" },
        { slug: "painter", name: "BrushAssist", icon: "🎨" },
      ].map((role) => (
        <a
          key={role.slug}
          href={`/${role.slug}`}
          style={{
            padding: "1.5rem",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            textDecoration: "none",
            color: "inherit",
            minWidth: "180px",
          }}
        >
          <div style={{ fontSize: "2rem" }}>{role.icon}</div>
          <h3>{role.name}</h3>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
            for {role.slug}s
          </p>
        </a>
      ))}
    </div>
  </div>
);

const RoleLandingPage = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>Role Landing Page</h1>
    <p>This will be the role-specific landing page with branding.</p>
  </div>
);

const ChatPage = () => (
  <div style={{ padding: "2rem" }}>
    <h1>Chat</h1>
    <p>AI Chat interface will be implemented here.</p>
  </div>
);

const LoginPage = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>Login</h1>
    <p>Cognito authentication will be implemented here.</p>
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
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
            <Route path="/:roleSlug" element={<RoleLandingPage />} />
            <Route path="/:roleSlug/chat" element={<ChatPage />} />
            <Route
              path="/:roleSlug/chat/:conversationId"
              element={<ChatPage />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
