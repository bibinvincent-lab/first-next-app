// src/lib/edgeSession.js - Edge Runtime compatible session validation

// Session configuration (copied to avoid Node.js dependency)
const SESSION_CONFIG = {
  TOKEN_LENGTH: 64,
};

// Validate session token format (Edge-compatible)
function isValidSessionToken(token) {
  return typeof token === 'string' && 
         token.length === SESSION_CONFIG.TOKEN_LENGTH * 2 && 
         /^[a-f0-9]+$/i.test(token);
}

// Edge-compatible session validation (no Node.js crypto)
export async function validateSessionEdge(sessionToken) {
  try {
    // Check token format
    if (!isValidSessionToken(sessionToken)) {
      return false;
    }

    // In Edge Runtime, we need to make a fetch request to validate session
    // since we can't use Node.js database connections directly
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_API_URL || 'https://yourdomain.com'
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/auth/check`, {
      method: 'GET',
      headers: {
        'Cookie': `sessionToken=${sessionToken}`
      }
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.authenticated;
  } catch (error) {
    console.error('Edge session validation error:', error);
    return false;
  }
}
