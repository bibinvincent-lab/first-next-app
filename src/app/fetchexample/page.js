"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, Chip, Avatar } from "@mui/material";

export default function UsersSection() {
  const [users, setUsers] = useState([]);
  const [isError, setIsError] = useState(false);

  // ✅ FETCH DATA
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        console.error(err);
        setIsError(true);
      });
  }, []);

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
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={user.id}>
                        <Paper sx={{ p: 3 }}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography>{user.name}</Typography>
                            <Avatar>{user.name.charAt(0)}</Avatar>
                          </Box>
                          <Typography>{user.email}</Typography>
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