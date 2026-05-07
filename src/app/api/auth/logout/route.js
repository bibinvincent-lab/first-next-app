import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Get session token from cookies
    const sessionToken = req.cookies.get('sessionToken')?.value;

    if (sessionToken) {
      const connection = await createConnection();
      
      try {
        // Remove session from database
        await connection.execute(
          'DELETE FROM user_sessions WHERE session_token = ?',
          [sessionToken]
        );
      } finally {
        if (connection) {
          connection.release();
        }
      }
    }

    // Clear session cookie
    const response = NextResponse.json(
      { success: true, message: 'Logout successful' },
      { status: 200 }
    );

    response.cookies.set('sessionToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Logout failed' },
      { status: 500 }
    );
  }
}
