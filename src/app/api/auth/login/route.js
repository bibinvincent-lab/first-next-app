import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { 
  generateSessionToken, 
  calculateSessionExpiry,
  cleanExpiredSessions,
  SESSION_CONFIG 
} from '@/lib/session';
import { checkRateLimit, logRateLimitViolation } from '@/lib/rateLimit';
import { 
  generateDeviceFingerprint, 
  registerUserDevice,
  logSecurityEvent 
} from '@/lib/security';

export async function POST(req) {
  // Check rate limit first
  const rateLimitResult = await checkRateLimit(req, 'LOGIN');
  if (!rateLimitResult.allowed) {
    if (rateLimitResult.blocked) {
      // Log the violation
      const clientId = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
      await logRateLimitViolation(req, 'LOGIN', clientId);
    }
    return NextResponse.json(
      { success: false, message: rateLimitResult.message },
      { status: 429 }
    );
  }
  try {
    const { email, password } = await req.json();

    if (!email || !email.includes('@') || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const connection = await createConnection();

    try {
      // Clean expired sessions
      await cleanExpiredSessions(connection);

      // Always perform user lookup to prevent timing attacks
      const [users] = await connection.execute(
        'SELECT id, email, password_hash, role FROM users WHERE email = ?',
        [email]
      );

      // Constant-time response regardless of user existence
      if (users.length === 0) {
        // Simulate bcrypt comparison timing
        await bcrypt.compare(password, '$2b$10$dummyhashfordummyuserdummyhashfordummyuser');
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const user = users[0];

      // Verify password with bcrypt
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      }

    // Generate device fingerprint
    const deviceFingerprint = generateDeviceFingerprint(req);
    const ipAddress = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Delete all previous sessions for this user (one device login only)
    await connection.execute(
      'DELETE FROM user_sessions WHERE user_id = ?',
      [user.id]
    );

    // Create new session with device binding
    const sessionToken = generateSessionToken();
    const expiresAt = calculateSessionExpiry();

    await connection.execute(
      'INSERT INTO user_sessions (user_id, session_token, expires_at, device_fingerprint, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
      [user.id, sessionToken, expiresAt, deviceFingerprint, ipAddress, userAgent]
    );

    // Register device for tracking
    const deviceInfo = {
      deviceName: `${req.headers.get('sec-ch-ua-platform') || 'Unknown'} - ${req.headers.get('sec-ch-ua')?.split(',')[0] || 'Unknown Browser'}`,
      deviceType: 'web',
      browser: req.headers.get('sec-ch-ua')?.split(',')[0] || 'Unknown',
      platform: req.headers.get('sec-ch-ua-platform') || 'Unknown',
      ipAddress,
      userAgent
    };
    
    await registerUserDevice(user.id, deviceFingerprint, deviceInfo);

    // Set secure httpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        email: user.email,
        role: user.role
      },
      redirectTo: getRedirectPath(user.role)
    });


    response.cookies.set('sessionToken', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: SESSION_CONFIG.EXPIRY_MINUTES * 60,
      path: '/',
    });


    return response;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    );
  }
}

// Helper function to determine redirect path based on role
function getRedirectPath(role) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'manager':
      return '/manager/dashboard';
    case 'user':
      return '/user/dashboard';
    default:
      return '/user/dashboard';
  }
}
