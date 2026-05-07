// src/app/admin/dashboard/page.js
'use client';
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
  People,
  Login,
  AdminPanelSettings,
  Security,
} from '@mui/icons-material';

export default function AdminDashboard() {
  const { user, requireRole } = useAuth();

  requireRole('admin');

  if (!user || user.role !== 'admin') {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          Admin access required.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>

      </Box>

      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Welcome, Administrator
        </Typography>
        <Typography variant="body1" paragraph>
          You have full administrative access to the system. Monitor user activity, manage permissions, and oversee system operations from this central dashboard.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your role includes managing all users, monitoring system health, and ensuring security protocols are maintained.
        </Typography>
      </Paper>

      {/* Quick Stats */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="primary">
                    System
                  </Typography>
                  <Typography color="text.secondary">
                    User Management
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
                <Login color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="success.main">
                    Active
                  </Typography>
                  <Typography color="text.secondary">
                    Session Monitor
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
                <AdminPanelSettings color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="warning.main">
                    Control
                  </Typography>
                  <Typography color="text.secondary">
                    System Settings
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
                <Security color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="info.main">
                    Secure
                  </Typography>
                  <Typography color="text.secondary">
                    Security Center
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
            <Button variant="contained" fullWidth startIcon={<People />}>
              Manage Users
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="outlined" fullWidth startIcon={<Login />}>
              View Sessions
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="outlined" fullWidth startIcon={<Security />}>
              Security Settings
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="outlined" fullWidth startIcon={<AdminPanelSettings />}>
              System Logs
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
