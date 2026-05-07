// src/components/Navigation.js
'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Dashboard,
  Article,
} from '@mui/icons-material';
import { useState } from 'react';

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'manager':
        return '/manager/dashboard';
      case 'user':
        return '/user/dashboard';
      default:
        return '/user/dashboard';
    }
  };

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            MyApp
          </Link>
        </Typography>

        {isAuthenticated && user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button color="inherit" component={Link} href="/blog">
              <Article sx={{ mr: 1 }} />
              Blog
            </Button>

            <Button color="inherit" component={Link} href={getDashboardLink()}>
              <Dashboard sx={{ mr: 1 }} />
              Dashboard
            </Button>

            <Chip 
              label={user.role} 
              color="primary" 
              size="small" 
              sx={{ textTransform: 'capitalize' }}
            />

            <Button
              color="inherit"
              onClick={handleMenu}
              startIcon={<AccountCircle />}
            >
              {user.email}
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} href="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} href="/register">
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
