import type { ThemeOptions } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

export interface RoleTheme {
  primaryColor: string;
  secondaryColor: string;
  brandName: string;
  icon: string;
}

const baseThemeOptions: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1920,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          padding: "10px 24px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: "xl",
      },
      styleOverrides: {
        maxWidthXl: {
          maxWidth: "1440px !important",
          "@media (min-width: 1920px)": {
            maxWidth: "1600px !important",
          },
        },
      },
    },
  },
};

export const createRoleTheme = (roleTheme?: RoleTheme) => {
  const primary = roleTheme?.primaryColor || "#2563EB";
  const secondary = roleTheme?.secondaryColor || "#1E40AF";

  return createTheme({
    ...baseThemeOptions,
    palette: {
      primary: {
        main: primary,
      },
      secondary: {
        main: secondary,
      },
      background: {
        default: "#F8FAFC",
        paper: "#FFFFFF",
      },
    },
  });
};

export const defaultTheme = createRoleTheme();
