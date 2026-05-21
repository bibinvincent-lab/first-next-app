// src/lib/edgeSession.js - Edge Runtime compatible session validation

const SESSION_TOKEN_LENGTH = 64;

// Validate session token format (Edge-compatible, no Node.js crypto)
export function isValidSessionTokenFormat(token) {
  return typeof token === 'string' && 
         token.length === SESSION_TOKEN_LENGTH * 2 && 
         /^[a-f0-9]+$/i.test(token);
}
