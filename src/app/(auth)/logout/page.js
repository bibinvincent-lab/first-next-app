"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, CircularProgress } from '@mui/material';
import { useAuth } from "@/hooks/useAuth";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    // Perform logout
    const performLogout = async () => {
      await logout();
    };

    performLogout();
  }, [logout]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.50',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress
          sx={{
            mb: 2,
            color: 'primary.main',
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 'semibold', color: 'grey.800', mb: 1 }}>
          Logging out...
        </Typography>
        <Typography variant="body1" sx={{ color: 'grey.600' }}>
          You will be redirected to the login page shortly.
        </Typography>
      </Box>
    </Box>
  );
}