// src/app/manager/dashboard/page.js
'use client';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  People,
  Assessment,
  Assignment,
  Timeline,
} from '@mui/icons-material';

export default function ManagerDashboard() {
  const { user, requireRole, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const authorized = requireRole('manager');
      setIsAuthorized(authorized);
    }
  }, [isLoading, requireRole]);

  // Show loading state while checking authorization
  if (isLoading || !isAuthorized) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Checking authorization...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!user || user.role !== 'manager') {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          Manager access required.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manager Dashboard
        </Typography>
        
      </Box>

      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Welcome, Manager
        </Typography>
        <Typography variant="body1" paragraph>
          As a manager, you have oversight of team activities and project progress. Monitor your team's performance, assign tasks, and ensure project deadlines are met efficiently.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your responsibilities include team coordination, performance tracking, and resource management to achieve organizational goals.
        </Typography>
      </Paper>

      {/* Quick Stats */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="primary">
                    Team
                  </Typography>
                  <Typography color="text.secondary">
                    Member Overview
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assignment color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="success.main">
                    Tasks
                  </Typography>
                  <Typography color="text.secondary">
                    Project Status
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Timeline color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="warning.main">
                    Track
                  </Typography>
                  <Typography color="text.secondary">
                    Progress Monitor
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assessment color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="info.main">
                    Reports
                  </Typography>
                  <Typography color="text.secondary">
                    Analytics Hub
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
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button variant="contained" fullWidth startIcon={<People />}>
              View Team
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button variant="outlined" fullWidth startIcon={<Assignment />}>
              Tasks
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button variant="outlined" fullWidth startIcon={<Timeline />}>
              Reports
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button variant="outlined" fullWidth startIcon={<Assessment />}>
              Analytics
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
