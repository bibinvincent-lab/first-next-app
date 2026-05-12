// src/app/user/dashboard/page.js
'use client';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Paper,
} from '@mui/material';
import {
  Assignment,
  CalendarToday,
  Logout,
  Person,
  Email,
} from '@mui/icons-material';

export default function UserDashboard() {
  const { user, logout, requireRole } = useAuth();

  useEffect(() => {
    requireRole('user');
  }, [requireRole]);

  if (!user || user.role !== 'user') {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          User access required.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Logout />}
          onClick={logout}
          color="error"
        >
          Logout
        </Button>
      </Box>

      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Welcome back, {user.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Here's your activity overview
        </Typography>
      </Paper>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="contained" fullWidth startIcon={<Assignment />}>
              View Tasks
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="outlined" fullWidth startIcon={<CalendarToday />}>
              Calendar
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="outlined" fullWidth startIcon={<Person />}>
              Profile
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="outlined" fullWidth startIcon={<Email />}>
              Messages
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
