import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  isSessionExpired, 
  isSessionInactive,
  cleanExpiredSessions 
} from '@/lib/session';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken")?.value;

    // console.log('DEBUG: Session check - sessionToken:', sessionToken);

    if (!sessionToken) {
      console.log('No session token found, redirecting to login');
      return NextResponse.json(
        { authenticated: false, message: 'No session token' },
        { status: 200 }
      );
    }

    const connection = await createConnection();

    try {
      // Clean expired sessions
      await cleanExpiredSessions(connection);

      // Find session in database
      const [sessions] = await connection.execute(
        `SELECT s.expires_at, s.last_activity, u.email, u.role 
         FROM user_sessions s 
         JOIN users u ON s.user_id = u.id 
         WHERE s.session_token = ?`,
        [sessionToken]
      );

      // console.log('DEBUG: Database query result:', sessions.length, 'sessions found');

      if (sessions.length === 0) {
        // console.log('DEBUG: No sessions found in database');
        return NextResponse.json(
          { authenticated: false, message: 'Invalid session' },
          { status: 200 }
        );
      }

      const session = sessions[0];
      // console.log('DEBUG: Session data:', {
      //   expires_at: session.expires_at,
      //   last_activity: session.last_activity,
      //   email: session.email,
      //   role: session.role
      // });

      // Check expiry and inactivity
      const expired = isSessionExpired(session.expires_at);
      const inactive = isSessionInactive(session.last_activity);
      // console.log('DEBUG: Session checks:', { expired, inactive });

      if (expired || inactive) {
        // console.log('DEBUG: Session expired or inactive, removing session');
        // Remove expired session
        await connection.execute(
          'DELETE FROM user_sessions WHERE session_token = ?',
          [sessionToken]
        );
        
        return NextResponse.json(
          { authenticated: false, message: 'Session expired' },
          { status: 200 }
        );
      }

      // console.log('DEBUG: Session valid, updating last activity');
      // Update last activity
      await connection.execute(
        'UPDATE user_sessions SET last_activity = NOW() WHERE session_token = ?',
        [sessionToken]
      );

      // console.log('DEBUG: Returning authenticated response for user:', session.email);
      return NextResponse.json({
          authenticated: true,
          user: {
            email: session.email,
            role: session.role
          }
        });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { authenticated: false, message: 'Session check failed' },
      { status: 200 }
    );
  }
}
