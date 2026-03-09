import * as Yup from "yup";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useFormik } from "formik";
import { useState } from "react";

const emailSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

const resetSchema = Yup.object({
  code: Yup.string().length(6, "Code must be 6 digits").required("Verification code is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[^A-Za-z0-9]/, "Must contain at least one special character")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { forgotPassword, confirmNewPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");

  const emailFormik = useFormik({
    initialValues: { email: "" },
    validationSchema: emailSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      try {
        await forgotPassword(values.email);
        setEmail(values.email);
        setStep("reset");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to send reset code. Please try again.";
        setError(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const resetFormik = useFormik({
    initialValues: { code: "", newPassword: "", confirmPassword: "" },
    validationSchema: resetSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      try {
        await confirmNewPassword(email, values.code, values.newPassword);
        navigate("/login");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Password reset failed. Please try again.";
        setError(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center" fontWeight={700}>
            {step === "email" ? "Forgot Password" : "Reset Password"}
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            {step === "email"
              ? "Enter your email to receive a reset code"
              : `Enter the code sent to ${email}`}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {step === "email" ? (
            <form onSubmit={emailFormik.handleSubmit}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                type="email"
                value={emailFormik.values.email}
                onChange={emailFormik.handleChange}
                onBlur={emailFormik.handleBlur}
                error={emailFormik.touched.email && Boolean(emailFormik.errors.email)}
                helperText={emailFormik.touched.email && emailFormik.errors.email}
                sx={{ mb: 3 }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={emailFormik.isSubmitting}
                sx={{ mb: 2 }}
              >
                {emailFormik.isSubmitting ? <CircularProgress size={24} /> : "Send Reset Code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={resetFormik.handleSubmit}>
              <TextField
                fullWidth
                id="code"
                name="code"
                label="Verification Code"
                value={resetFormik.values.code}
                onChange={resetFormik.handleChange}
                onBlur={resetFormik.handleBlur}
                error={resetFormik.touched.code && Boolean(resetFormik.errors.code)}
                helperText={resetFormik.touched.code && resetFormik.errors.code}
                inputProps={{ maxLength: 6 }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                id="newPassword"
                name="newPassword"
                label="New Password"
                type="password"
                value={resetFormik.values.newPassword}
                onChange={resetFormik.handleChange}
                onBlur={resetFormik.handleBlur}
                error={resetFormik.touched.newPassword && Boolean(resetFormik.errors.newPassword)}
                helperText={resetFormik.touched.newPassword && resetFormik.errors.newPassword}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                value={resetFormik.values.confirmPassword}
                onChange={resetFormik.handleChange}
                onBlur={resetFormik.handleBlur}
                error={
                  resetFormik.touched.confirmPassword && Boolean(resetFormik.errors.confirmPassword)
                }
                helperText={
                  resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword
                }
                sx={{ mb: 3 }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={resetFormik.isSubmitting}
                sx={{ mb: 2 }}
              >
                {resetFormik.isSubmitting ? <CircularProgress size={24} /> : "Reset Password"}
              </Button>
            </form>
          )}

          <Typography variant="body2" textAlign="center">
            <Link component={RouterLink} to="/login">
              Back to Sign In
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
