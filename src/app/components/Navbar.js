"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, isLoading, logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: 1,
        borderColor: 'grey.200',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ maxWidth: 'lg', width: '100%', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 } }}>
        {/* Logo */}
        <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'linear-gradient(45deg, #2563eb 30%, #9333ea 90%)',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>
              B
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.900' }}>
            BlogSpace
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mr: 2 }}>
            <Button component={Link} href="/" sx={{ color: 'grey.600', '&:hover': { color: 'grey.900' } }}>
              Home
            </Button>
            <Button component={Link} href="/blog" sx={{ color: 'grey.600', '&:hover': { color: 'grey.900' } }}>
              Blog
            </Button>
            
            <Button component={Link} href="/tablepage" sx={{ color: 'grey.600', '&:hover': { color: 'grey.900' } }}>
              Add User
            </Button>
            <Button component={Link} href="/test" sx={{ color: 'grey.600', '&:hover': { color: 'grey.900' } }}>
              List Users
            </Button>
            <Button component={Link} href="/fetchexample" sx={{ color: 'grey.600', '&:hover': { color: 'grey.900' } }}>
              Fetch Users from api
            </Button>
            <Button component={Link} href="/contact" sx={{ color: 'grey.600', '&:hover': { color: 'grey.900' } }}>
              Contact
            </Button>
          </Box>
        )}

        {/* CTA Button & Avatar */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!isAuthenticated ? (
              <Button
                component={Link}
                href="/login"
                variant="contained"
                sx={{
                  bgcolor: 'linear-gradient(45deg, #2563eb 30%, #9333ea 90%)',
                  borderRadius: '9999px',
                  '&:hover': { boxShadow: 2, transform: 'scale(1.05)' },
                  transition: 'all 0.2s',
                }}
              >
                Get Started
              </Button>
            ) : (
              <>
                <Button
                  component={Link}
                  href={getDashboardLink()}
                  variant="outlined"
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': { borderColor: 'primary.dark', color: 'primary.dark' },
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="contained"
                  sx={{
                    bgcolor: 'linear-gradient(45deg, #dc2626 30%, #b91c1c 90%)',
                    borderRadius: '9999px',
                    '&:hover': { boxShadow: 2, transform: 'scale(1.05)' },
                    transition: 'all 0.2s',
                  }}
                >
                  Logout
                </Button>
                <Avatar
                  sx={{
                    bgcolor: 'linear-gradient(45deg, #a855f7 30%, #ec4899 90%)',
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 2 },
                    transition: 'all 0.2s',
                  }}
                  onClick={handleMenuClick}
                >
                  K
                </Avatar>
              </>
            )}
          </Box>
        )}

        {/* Mobile menu button */}
        {isMobile && (
          <IconButton
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            sx={{ color: 'grey.600' }}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Navigation */}
      {isMobile && isMenuOpen && (
        <Box sx={{ bgcolor: 'white', borderTop: 1, borderColor: 'grey.200', py: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 2 }}>
            <Button component={Link} href="/" sx={{ justifyContent: 'flex-start', color: 'grey.600' }}>
              Home
            </Button>
            <Button component={Link} href="/blog" sx={{ justifyContent: 'flex-start', color: 'grey.600' }}>
              Blog
            </Button>
            <Button component={Link} href="/tablepage" sx={{ justifyContent: 'flex-start', color: 'grey.600' }}>
              Add User
            </Button>
            <Button component={Link} href="/test" sx={{ justifyContent: 'flex-start', color: 'grey.600' }}>
              List Users
            </Button>
            <Button component={Link} href="/fetchexample" sx={{ justifyContent: 'flex-start', color: 'grey.600' }}>
              Fetch Users
            </Button>
            <Button component={Link} href="/contact" sx={{ justifyContent: 'flex-start', color: 'grey.600' }}>
              Contact
            </Button>
            {!isAuthenticated ? (
              <Button
                component={Link}
                href="/login"
                variant="contained"
                sx={{
                  bgcolor: 'linear-gradient(45deg, #2563eb 30%, #9333ea 90%)',
                  borderRadius: '9999px',
                  width: 'fit-content',
                }}
              >
                Get Started
              </Button>
            ) : (
              <Button
                onClick={handleLogout}
                variant="contained"
                sx={{
                  bgcolor: 'linear-gradient(45deg, #dc2626 30%, #b91c1c 90%)',
                  borderRadius: '9999px',
                  width: 'fit-content',
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Box>
      )}

      {/* Avatar Menu (if needed) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        
      </Menu>
    </AppBar>
  );
}