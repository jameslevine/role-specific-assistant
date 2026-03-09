import { create } from "zustand";

interface RoleConfig {
  slug: string;
  brandName: string;
  tagline: string;
  description: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  features: string[];
  regulations: string[];
  jurisdiction: string;
  available: boolean;
}

interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  selectedRole: string;
  tier: string;
  usage: {
    questionsUsedToday: number;
    questionsRemainingToday: number | null;
    documentsUsed: number;
    documentsLimit: number;
  };
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  accessToken: string | null;
  setAuthenticated: (isAuth: boolean) => void;
  setAccessToken: (token: string | null) => void;

  // User
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Role
  currentRole: RoleConfig | null;
  roles: RoleConfig[];
  setCurrentRole: (role: RoleConfig | null) => void;
  setRoles: (roles: RoleConfig[]) => void;

  // UI
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useStore = create<AppState>((set) => ({
  // Auth
  isAuthenticated: false,
  accessToken: null,
  setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
  setAccessToken: (token) => set({ accessToken: token }),

  // User
  user: null,
  setUser: (user) => set({ user }),

  // Role
  currentRole: null,
  roles: [],
  setCurrentRole: (role) => set({ currentRole: role }),
  setRoles: (roles) => set({ roles }),

  // UI
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
