// src/lib/security.js
import { createConnection } from './db';
import crypto from 'crypto';

// Security utility functions

// Generate secure random token
export function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Generate device fingerprint
export function generateDeviceFingerprint(req) {
  const userAgent = req.headers.get('user-agent') || '';
  const acceptLanguage = req.headers.get('accept-language') || '';
  const acceptEncoding = req.headers.get('accept-encoding') || '';
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  
  const fingerprint = crypto
    .createHash('sha256')
    .update(`${ip}:${userAgent}:${acceptLanguage}:${acceptEncoding}`)
    .digest('hex');
  
  return fingerprint;
}

// Log security event
export async function logSecurityEvent(eventType, severity, userId, ipAddress, userAgent, description, metadata = null) {
  let connection;
  try {
    connection = await createConnection();
    await connection.execute(
      `INSERT INTO security_events (event_type, severity, user_id, ip_address, user_agent, description, metadata) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [eventType, severity, userId, ipAddress, userAgent, description, metadata ? JSON.stringify(metadata) : null]
    );
  } catch (error) {
    console.error('Failed to log security event:', error);
  } finally {
    if (connection) connection.release();
  }
}

// Log failed login attempt
export async function logFailedLogin(email, ipAddress, userAgent, reason) {
  let connection;
  try {
    connection = await createConnection();
    await connection.execute(
      'INSERT INTO failed_login_attempts (email, ip_address, user_agent, reason) VALUES (?, ?, ?, ?)',
      [email, ipAddress, userAgent, reason]
    );
  } catch (error) {
    console.error('Failed to log failed login:', error);
  } finally {
    if (connection) connection.release();
  }
}

// Check if user is locked due to too many failed attempts
export async function isUserLocked(email) {
  let connection;
  try {
    connection = await createConnection();
    const [attempts] = await connection.execute(
      `SELECT COUNT(*) as count, MAX(attempt_time) as last_attempt 
       FROM failed_login_attempts 
       WHERE email = ? AND attempt_time > DATE_SUB(NOW(), INTERVAL 15 MINUTE)`,
      [email]
    );

    if (attempts[0].count >= 5) {
      return { locked: true, until: attempts[0].last_attempt };
    }
    return { locked: false };
  } catch (error) {
    console.error('Failed to check user lock status:', error);
    return { locked: false };
  } finally {
    if (connection) connection.release();
  }
}

// Register user device
export async function registerUserDevice(userId, deviceFingerprint, deviceInfo) {
  let connection;
  try {
    connection = await createConnection();
    await connection.execute(
      `INSERT INTO user_devices (user_id, device_fingerprint, device_name, device_type, browser, platform, ip_address, user_agent) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       last_seen = NOW(), 
       device_name = VALUES(device_name),
       ip_address = VALUES(ip_address)`,
      [
        userId,
        deviceFingerprint,
        deviceInfo.deviceName || 'Unknown Device',
        deviceInfo.deviceType || 'Unknown',
        deviceInfo.browser || 'Unknown',
        deviceInfo.platform || 'Unknown',
        deviceInfo.ipAddress || 'Unknown',
        deviceInfo.userAgent || 'Unknown'
      ]
    );
  } catch (error) {
    console.error('Failed to register user device:', error);
  } finally {
    if (connection) connection.release();
  }
}

// Validate session device
export async function validateSessionDevice(sessionToken, req) {
  let connection;
  try {
    connection = await createConnection();
    const [sessions] = await connection.execute(
      `SELECT s.user_id, s.device_fingerprint, u.email 
       FROM user_sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.session_token = ? AND s.is_active = TRUE`,
      [sessionToken]
    );

    if (sessions.length === 0) {
      return { valid: false, reason: 'Session not found or inactive' };
    }

    const session = sessions[0];
    const currentFingerprint = generateDeviceFingerprint(req);

    if (session.device_fingerprint && session.device_fingerprint !== currentFingerprint) {
      await logSecurityEvent(
        'session_device_mismatch',
        'high',
        session.user_id,
        req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        req.headers.get('user-agent') || '',
        'Session accessed from different device',
        { expected_fingerprint: session.device_fingerprint, current_fingerprint }
      );

      return { valid: false, reason: 'Device fingerprint mismatch' };
    }

    return { valid: true };
  } catch (error) {
    console.error('Failed to validate session device:', error);
    return { valid: false, reason: 'Validation error' };
  } finally {
    if (connection) connection.release();
  }
}

// Update user login tracking
export async function updateUserLogin(userId, ipAddress, userAgent) {
  let connection;
  try {
    connection = await createConnection();
    await connection.execute(
      'UPDATE users SET last_login = NOW(), login_attempts = 0 WHERE id = ?',
      [userId]
    );
  } catch (error) {
    console.error('Failed to update user login:', error);
  } finally {
    if (connection) connection.release();
  }
}

// Increment failed login attempts
export async function incrementFailedLoginAttempts(email) {
  let connection;
  try {
    connection = await createConnection();
    await connection.execute(
      'UPDATE users SET login_attempts = login_attempts + 1 WHERE email = ?',
      [email]
    );
  } catch (error) {
    console.error('Failed to increment failed login attempts:', error);
  } finally {
    if (connection) connection.release();
  }
}

// Lock user account
export async function lockUserAccount(email, durationMinutes = 30) {
  let connection;
  try {
    connection = await createConnection();
    await connection.execute(
      'UPDATE users SET locked_until = DATE_ADD(NOW(), INTERVAL ? MINUTE) WHERE email = ?',
      [durationMinutes, email]
    );
  } catch (error) {
    console.error('Failed to lock user account:', error);
  } finally {
    if (connection) connection.release();
  }
}

// Check if user account is locked
export async function isAccountLocked(email) {
  let connection;
  try {
    connection = await createConnection();
    const [users] = await connection.execute(
      'SELECT locked_until FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return { locked: false };
    }

    const lockedUntil = users[0].locked_until;
    if (lockedUntil && new Date(lockedUntil) > new Date()) {
      return { locked: true, until: lockedUntil };
    }

    return { locked: false };
  } catch (error) {
    console.error('Failed to check account lock status:', error);
    return { locked: false };
  } finally {
    if (connection) connection.release();
  }
}

// Generate email verification token
export function generateEmailVerificationToken() {
  return generateSecureToken(32);
}

// Generate password reset token
export function generatePasswordResetToken() {
  return generateSecureToken(32);
}

// Hash token for database storage
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Verify token hash
export function verifyTokenHash(token, hash) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  return tokenHash === hash;
}

// Sanitize filename for uploads
export function sanitizeFilename(filename) {
  if (!filename) return '';
  
  // Remove directory traversal attempts
  const sanitized = filename.replace(/[\.\.\/\\]/g, '');
  
  // Remove dangerous characters
  const cleaned = sanitized.replace(/[<>:"|?*]/g, '');
  
  // Limit length and add timestamp to prevent conflicts
  const timestamp = Date.now();
  const extension = cleaned.split('.').pop();
  const name = cleaned.substring(0, 50);
  
  return `${name}_${timestamp}.${extension}`;
}

// Validate file upload
export function validateFileUpload(file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'], maxSize = 5 * 1024 * 1024) {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File too large' };
  }

  return { valid: true };
}
