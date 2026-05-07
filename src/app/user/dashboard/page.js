// src/app/user/dashboard/page.js
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
} from '@mui/material';
import {
  Person,
  Assignment,
  CalendarToday,
  Logout,
  Email,
} from '@mui/icons-material';

export default function UserDashboard() {
  const { user, logout, requireRole } = useAuth();
  const [stats, setStats] = useState({
    completedTasks: 0,
    pendingTasks: 0,
    totalHours: 0,
  });

  useEffect(() => {
    requireRole('user');
    fetchStats();
  }, [requireRole]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/stats');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

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

      {/* Quick Stats */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assignment color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="primary">
                    {stats.completedTasks}
                  </Typography>
                  <Typography color="text.secondary">
                    Completed Tasks
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CalendarToday color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {stats.pendingTasks}
                  </Typography>
                  <Typography color="text.secondary">
                    Pending Tasks
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Person color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="info.main">
                    {stats.totalHours}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Hours
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Email color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="success.main">
                    User
                  </Typography>
                  <Typography color="text.secondary">
                    Profile
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
