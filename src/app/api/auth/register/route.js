import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { checkRateLimit, logRateLimitViolation } from '@/lib/rateLimit';

export async function POST(req) {
  // Check rate limit first
  const rateLimitResult = await checkRateLimit(req, 'REGISTER');
  if (!rateLimitResult.allowed) {
    if (rateLimitResult.blocked) {
      // Log the violation
      const clientId = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
      await logRateLimitViolation(req, 'REGISTER', clientId);
    }
    return NextResponse.json(
      { success: false, message: rateLimitResult.message },
      { status: 429 }
    );
  }
  try {
    const { email, password } = await req.json();

    if (!email || !email.includes('@') || !password || password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Email must be valid and password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const connection = await createConnection();

    try {
      // Check if user already exists
      const [existingUsers] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
      if (existingUsers.length > 0) {
        return NextResponse.json(
          { success: false, message: 'A user with this email already exists' },
          { status: 409 }
        );
      }

      // Hash password with bcrypt
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user with default role 'user'
      await connection.execute(
        'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
        [email, passwordHash, 'user']
      );

      return NextResponse.json({ 
        success: true, 
        message: 'Registration successful',
        user: { email, role: 'user' }
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Registration failed' },
      { status: 500 }
    );
  }
}
