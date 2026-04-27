import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const ensureAuthTable = async (db) => {
  await db.execute(
    `CREATE TABLE IF NOT EXISTS auth_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  );
};

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !email.includes('@') || !password || password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const db = await createConnection();
    await ensureAuthTable(db);

    const [rows] = await db.query('SELECT password_hash FROM auth_users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const passwordHash = hashPassword(password);
    if (rows[0].password_hash !== passwordHash) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const sessionToken = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    const response = NextResponse.json(
      { success: true, message: 'Login successful', email },
      { status: 200 }
    );

    response.cookies.set('sessionToken', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    response.cookies.set('userEmail', email, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
