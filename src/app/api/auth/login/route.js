import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { 
  generateSessionToken, 
  calculateSessionExpiry,
  cleanExpiredSessions,
  SESSION_CONFIG 
} from '@/lib/session';

export async function POST(req) {
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

      // Find user with role
      const [users] = await connection.execute(
        'SELECT id, email, password_hash, role FROM users WHERE email = ?',
        [email]
      );

    if (users.length === 0) {
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

    // Delete all previous sessions for this user (one device login only)
    await connection.execute(
      'DELETE FROM user_sessions WHERE user_id = ?',
      [user.id]
    );

    // Create new session
    const sessionToken = generateSessionToken();
    const expiresAt = calculateSessionExpiry();

    await connection.execute(
      'INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
      [user.id, sessionToken, expiresAt]
    );

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

    // console.log('DEBUG: Setting sessionToken cookie:', sessionToken);
    response.cookies.set('sessionToken', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_CONFIG.EXPIRY_MINUTES * 60,
      path: '/',
    });
    // console.log('DEBUG: SessionToken cookie set successfully');

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
