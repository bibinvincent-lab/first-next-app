// src/lib/session.js
import { randomBytes } from 'crypto';

// Session configuration
export const SESSION_CONFIG = {
  EXPIRY_MINUTES: 30, // Session expires after 30 minutes
  INACTIVITY_MINUTES: 15, // Session expires after 15 minutes of inactivity
  TOKEN_LENGTH: 64, // Length of session token
  MAX_CONCURRENT_SESSIONS: 3, // Maximum concurrent sessions per user
};

// Generate secure random session token
export const generateSessionToken = () => {
  return randomBytes(SESSION_CONFIG.TOKEN_LENGTH).toString('hex');
};

// Calculate session expiry time
export const calculateSessionExpiry = () => {
  const now = new Date();
  const expiry = new Date(now.getTime() + SESSION_CONFIG.EXPIRY_MINUTES * 60 * 1000);
  return expiry;
};

// Check if session is expired
export const isSessionExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt);
};

// Check if session is inactive
export const isSessionInactive = (lastActivity) => {
  const now = new Date();
  const inactiveTime = new Date(lastActivity.getTime() + SESSION_CONFIG.INACTIVITY_MINUTES * 60 * 1000);
  return now > inactiveTime;
};

// Validate session token format
export const isValidSessionToken = (token) => {
  return typeof token === 'string' && 
         token.length === SESSION_CONFIG.TOKEN_LENGTH * 2 && 
         /^[a-f0-9]+$/i.test(token);
};

// Clean expired sessions from database
export const cleanExpiredSessions = async (connection) => {
  try {
    const [result] = await connection.execute(
      'DELETE FROM user_sessions WHERE expires_at < NOW() OR last_activity < DATE_SUB(NOW(), INTERVAL ? MINUTE)',
      [SESSION_CONFIG.INACTIVITY_MINUTES]
    );
    return result.affectedRows;
  } catch (error) {
    console.error('Error cleaning expired sessions:', error);
    return 0;
  }
};
