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
        { success: false, message: 'Email must be valid and password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const db = await createConnection();
    await ensureAuthTable(db);

    const [existingUsers] = await db.query('SELECT id FROM auth_users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, message: 'A user with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    await db.execute('INSERT INTO auth_users (email, password_hash) VALUES (?, ?)', [email, passwordHash]);

    return NextResponse.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
