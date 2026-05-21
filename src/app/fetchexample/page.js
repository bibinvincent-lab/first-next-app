"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, Chip, Avatar, CircularProgress } from "@mui/material";
import { useAuth } from '@/hooks/useAuth';

export default function UsersSection() {
  const { isAuthenticated, isLoading: authLoading, requireAuth } = useAuth();
  const [users, setUsers] = useState([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      requireAuth();
    }
  }, [authLoading, requireAuth]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setIsError(true);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setIsError(true);
      });
  }, [isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress aria-label="Loading…" />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 8 }}>
      
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        
        <Grid container spacing={4}>
          
          <Grid size={12}>
            <Paper elevation={6} sx={{ borderRadius: 4, overflow: "hidden" }}>
              
              {/* HEADER */}
              <Box
                sx={{
                  background: "linear-gradient(to right, #0f172a, #1e293b, #0f172a)",
                  color: "white",
                  p: { xs: 4, sm: 6 }
                }}
              >
                <Chip
                  label="Live API example"
                  sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.1)", color: "#e2e8f0" }}
                />

                <Typography variant="h4" fontWeight="bold">
                  Fetch user data with a clean, modern interface.
                </Typography>

                {/* STATS */}
                <Grid container spacing={2} sx={{ mt: 3 }}>
                  <Grid size={6}>
                    <Box sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.1)" }}>
                      <Typography variant="caption">Users</Typography>
                      <Typography variant="h5">{users.length}</Typography>
                    </Box>
                  </Grid>

                  <Grid size={6}>
                    <Box sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.1)" }}>
                      <Typography variant="caption">Response</Typography>
                      <Typography variant="h5">{isError ? "Error" : "OK"}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* BODY */}
              <Box sx={{ p: 4 }}>
                
                <Grid container spacing={3}>
                  {isError ? (
                    <Grid size={12}>
                      <Typography color="error">Failed to load users</Typography>
                    </Grid>
                  ) : users.length === 0 ? (
                    <Grid size={12}>
                      <Typography>Loading...</Typography>
                    </Grid>
                  ) : (
                    users.map((user) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={user.rollno}>
                        <Paper sx={{ p: 3 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">{user.name}</Typography>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                          </Box>
                          <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                          <Typography variant="body2" color="text.secondary">{user.phoneno}</Typography>
                          <Typography variant="body2">Age: {user.age}</Typography>
                        </Paper>
                      </Grid>
                    ))
                  )}
                </Grid>

              </Box>
            </Paper>
          </Grid>

        </Grid>

      </Box>
    </Box>
  );
}