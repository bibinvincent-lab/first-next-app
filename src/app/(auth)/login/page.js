"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Stack,
  Card,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAuth } from "@/hooks/useAuth";

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  background:
    "radial-gradient(circle at 50% 50%, #f5f7ff, #ffffff)",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 420,
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "0px 5px 15px rgba(0,0,0,0.08), 0px 15px 35px rgba(0,0,0,0.05)",
}));

export default function SignIn() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    if (!email || !email.includes("@")) {
      setEmailError(true);
      return;
    } else {
      setEmailError(false);
    }

    if (!password || password.length < 8) {
      setPasswordError(true);
      return;
    } else {
      setPasswordError(false);
    }

    const result = await login(email, password);
    if (!result.success) {
      setError(result.message || "Login failed");
    }
  };

  return (
    <>
      <CssBaseline />

      <SignInContainer>
        <StyledCard>
          <Typography variant="h4" textAlign="center">
            Sign In
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <FormLabel>Email</FormLabel>
              <TextField
                id="email"
                name="email"
                type="email"
                error={emailError}
                helperText={emailError && "Enter a valid email"}
                placeholder="you@example.com"
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Password</FormLabel>
              <TextField
                id="password"
                name="password"
                type="password"
                error={passwordError}
                helperText={passwordError && "Min 8 characters"}
                placeholder="••••••"
              />
            </FormControl>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>

            <Box textAlign="center" mt={2}>
              <Link href="#" underline="hover">
                Forgot password?
              </Link>
            </Box>

            <Box textAlign="center" mt={1}>
              <Typography variant="body2">
                Don&apos;t have an account? <Link href="/register">Register</Link>
              </Typography>
            </Box>
          </Box>
        </StyledCard>
      </SignInContainer>
    </>
  );
}