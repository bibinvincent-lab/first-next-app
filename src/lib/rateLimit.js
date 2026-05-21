// src/lib/rateLimit.js
import { createConnection } from './db';

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  LOGIN: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5, // 5 attempts per window
    blockDurationMs: 1 * 60 * 1000, // 1 minutes block
  },
  REGISTER: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 3, // 3 registrations per hour
    blockDurationMs: 2 * 60 * 60 * 1000, // 2 hours block
  },
  GENERAL: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 200, // 100 requests per window
    blockDurationMs: 5 * 60 * 1000, // 5 minutes block
  }
};

// In-memory store for rate limiting (for production, use Redis)
const rateLimitStore = new Map();

// Generate client identifier
function getClientIdentifier(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown';
  const userAgent = req.headers.get('user-agent') || '';
  return `${ip}:${Buffer.from(userAgent).toString('base64').slice(0, 16)}`;
}

// Clean expired entries
function cleanExpiredEntries() {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (data.blockUntil && data.blockUntil < now) {
      rateLimitStore.delete(key);
    } else if (data.resetTime < now && data.count === 0) {
      rateLimitStore.delete(key);
    }
  }
}

// Check rate limit
export async function checkRateLimit(req, type = 'GENERAL') {
  const config = RATE_LIMIT_CONFIG[type];
  const clientId = getClientIdentifier(req);
  const now = Date.now();

  // Clean expired entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean
    cleanExpiredEntries();
  }

  const existing = rateLimitStore.get(clientId);

  // Check if client is blocked
  if (existing && existing.blockUntil && existing.blockUntil > now) {
    const remainingTime = Math.ceil((existing.blockUntil - now) / 1000 / 60);
    return {
      allowed: false,
      blocked: true,
      remainingTime,
      message: `Too many attempts. Try again in ${remainingTime} minutes.`
    };
  }

  // Initialize or update counter
  if (!existing || existing.resetTime < now) {
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + config.windowMs,
      blockUntil: null
    });
    return { allowed: true, blocked: false };
  }

  // Increment counter
  existing.count++;

  // Check if limit exceeded
  if (existing.count > config.maxAttempts) {
    existing.blockUntil = now + config.blockDurationMs;
    const remainingTime = Math.ceil(config.blockDurationMs / 1000 / 60);
    return {
      allowed: false,
      blocked: true,
      remainingTime,
      message: `Rate limit exceeded. Try again in ${remainingTime} minutes.`
    };
  }

  return { allowed: true, blocked: false };
}

// Log rate limit violations for monitoring
export async function logRateLimitViolation(req, type, clientId) {
  let connection;
  try {
    connection = await createConnection();
    await connection.execute(
      'INSERT INTO rate_limit_logs (client_id, endpoint, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, NOW())',
      [
        clientId,
        type,
        req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        req.headers.get('user-agent') || ''
      ]
    );
  } catch (error) {
    console.error('Failed to log rate limit violation');
  } finally {
    if (connection) connection.release();
  }
}
