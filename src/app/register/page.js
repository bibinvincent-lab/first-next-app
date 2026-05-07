"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  FormControlLabel,
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

const RegisterContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  background: "radial-gradient(circle at 50% 50%, #f3f7ff, #ffffff)",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 460,
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow: "0px 5px 15px rgba(0,0,0,0.08), 0px 15px 35px rgba(0,0,0,0.05)",
}));

export default function RegisterPage() {
     
      
  const router = useRouter();
  
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Unable to register.");
        return;
      }

      setSuccess("Registration successful. You can now log in.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <RegisterContainer>
        <StyledCard>
          <Typography variant="h4" textAlign="center">
            Create Account
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <FormLabel>Email</FormLabel>
              <TextField
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                fullWidth
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Password</FormLabel>
              <TextField
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                fullWidth
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Confirm Password</FormLabel>
              <TextField
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                fullWidth
              />
            </FormControl>

            <Box mt={2}>
              <Button type="submit" variant="contained" fullWidth disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} /> : "Register"}
              </Button>
            </Box>
          </Box>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Already have an account?
            </Typography>
            <Link href="/login" underline="hover">
              Sign in
            </Link>
          </Box>
        </StyledCard>
      </RegisterContainer>
    </>
  );
}
