// Routes
export const ROUTES = {
  HOME: "/",
  ROLE_LANDING: "/:roleSlug",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  CHAT: "/:roleSlug/chat",
  CHAT_CONVERSATION: "/:roleSlug/chat/:conversationId",
  DOCUMENTS: "/:roleSlug/documents",
  BILLING: "/billing",
  PROFILE: "/profile",
} as const;

// Subscription Tiers
export const TIERS = {
  FREE: "free",
  PRO: "pro",
  BUSINESS: "business",
} as const;

// Tier Display Names
export const TIER_DISPLAY_NAMES: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  business: "Business",
};

// Tier Prices
export const TIER_PRICES: Record<string, string> = {
  free: "£0",
  pro: "£9.99/mo",
  business: "£29.99/mo",
};

// Role Brand Config
export const ROLE_BRANDS: Record<
  string,
  { name: string; tagline: string; icon: string; color: string }
> = {
  electrician: {
    name: "SparkAssist",
    tagline: "Your AI Wiring Companion",
    icon: "⚡",
    color: "#F59E0B",
  },
  plumber: {
    name: "PipeAssist",
    tagline: "Your AI Plumbing Expert",
    icon: "🔧",
    color: "#3B82F6",
  },
  bricklayer: {
    name: "BrickAssist",
    tagline: "Build Smarter, Build Right",
    icon: "🧱",
    color: "#DC2626",
  },
  carpenter: {
    name: "TimberAssist",
    tagline: "Crafted Intelligence for Joiners",
    icon: "🪚",
    color: "#92400E",
  },
  painter: {
    name: "BrushAssist",
    tagline: "Your AI Decorating Partner",
    icon: "🎨",
    color: "#7C3AED",
  },
};

// API
export const MAX_MESSAGE_LENGTH = 4000;
export const DEFAULT_PAGE_SIZE = 20;
