import { useCallback, useEffect } from "react";

import { authService } from "../services/auth";
import { useStore } from "../store";

export const useAuth = () => {
  const { isAuthenticated, setAuthenticated, setAccessToken, setUser } = useStore();

  const checkAuth = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const token = await authService.getAccessToken();
        setAuthenticated(true);
        setAccessToken(token);
      } else {
        setAuthenticated(false);
        setAccessToken(null);
      }
    } catch {
      setAuthenticated(false);
      setAccessToken(null);
    }
  }, [setAuthenticated, setAccessToken]);

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
    login,
    register,
    verifyEmail,
    forgotPassword,
    confirmNewPassword,
    logout,
    checkAuth,
  };
};
