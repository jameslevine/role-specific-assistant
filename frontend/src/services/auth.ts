import {
  confirmResetPassword,
  confirmSignUp,
  fetchAuthSession,
  getCurrentUser,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from "@aws-amplify/auth";

// Amplify is configured in main.tsx before app renders

export const authService = {
  signIn: async (email: string, password: string) => {
    const result = await signIn({
      username: email,
      password,
    });
    return result;
  },

  signUp: async (email: string, password: string, firstName: string, lastName: string) => {
    const result = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          given_name: firstName,
          family_name: lastName,
        },
      },
    });
    return result;
  },

  confirmSignUp: async (email: string, code: string) => {
    const result = await confirmSignUp({
      username: email,
      confirmationCode: code,
    });
    return result;
  },

  resetPassword: async (email: string) => {
    const result = await resetPassword({
      username: email,
    });
    return result;
  },

  confirmResetPassword: async (email: string, code: string, newPassword: string) => {
    const result = await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword,
    });
    return result;
  },

  signOut: async () => {
    await signOut();
  },

  getCurrentUser: async () => {
    try {
      const user = await getCurrentUser();
      return user;
    } catch {
      return null;
    }
  },

  getAccessToken: async (): Promise<string | null> => {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString() || null;
    } catch {
      return null;
    }
  },
};
