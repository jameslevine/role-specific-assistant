import { useCallback, useEffect, useState } from "react";

import { apiClient } from "../services/apiClient";
import { authService } from "../services/auth";
import { useStore } from "../store";

export const useAuth = () => {
  const { isAuthenticated, setAuthenticated, setAccessToken, setUser } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const token = await authService.getAccessToken();
        setAuthenticated(true);
        setAccessToken(token);

        // Fetch user profile from API
        try {
          const profile = await apiClient.get<Record<string, unknown>>("/users/me");
          setUser(profile as any);
        } catch {
          // User profile fetch failed — not critical
        }
      } else {
        setAuthenticated(false);
        setAccessToken(null);
      }
    } catch {
      setAuthenticated(false);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, [setAuthenticated, setAccessToken, setUser]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    if (result.isSignedIn) {
      const token = await authService.getAccessToken();
      setAuthenticated(true);
      setAccessToken(token);
    }
    return result;
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const result = await authService.signUp(email, password, firstName, lastName);
    return result;
  };

  const verifyEmail = async (email: string, code: string) => {
    const result = await authService.confirmSignUp(email, code);
    return result;
  };

  const forgotPassword = async (email: string) => {
    const result = await authService.resetPassword(email);
    return result;
  };

  const confirmNewPassword = async (email: string, code: string, newPassword: string) => {
    const result = await authService.confirmResetPassword(email, code, newPassword);
    return result;
  };

  const logout = async () => {
    await authService.signOut();
    setAuthenticated(false);
    setAccessToken(null);
    setUser(null);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    register,
    verifyEmail,
    forgotPassword,
    confirmNewPassword,
    logout,
    checkAuth,
  };
};
