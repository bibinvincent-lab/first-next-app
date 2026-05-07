// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Check session status
  const checkSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setUser(data.user);
        
        // Redirect based on role
        if (data.redirectTo) {
          router.push(data.redirectTo);
        }
        
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      router.push('/login');
    }
  }, [router]);

  // Register function
  const register = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Require authentication - redirect if not authenticated
  const requireAuth = useCallback(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return false;
    }
    return true;
  }, [isLoading, isAuthenticated, router]);

  // Require specific role - redirect if user doesn't have required role
  const requireRole = useCallback((requiredRole) => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return false;
      }
      
      if (user?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user's role
        switch (user?.role) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'manager':
            router.push('/manager/dashboard');
            break;
          case 'user':
            router.push('/user/dashboard');
            break;
          default:
            router.push('/login');
        }
        return false;
      }
    }
    return true;
  }, [isLoading, isAuthenticated, user, router]);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles) => {
    return roles.includes(user?.role);
  }, [user]);

  // Auto-check session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Set up periodic session check (every 30 seconds) - disabled to prevent interference
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     const interval = setInterval(checkSession, 30000);
  //     return () => clearInterval(interval);
  //   }
  // }, [isAuthenticated, checkSession]);

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    register,
    checkSession,
    requireAuth,
    requireRole,
    hasRole,
    hasAnyRole,
  };
};
