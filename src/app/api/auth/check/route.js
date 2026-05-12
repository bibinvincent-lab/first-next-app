import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';

import { 
  isSessionExpired, 
  isSessionInactive,
  cleanExpiredSessions 
} from '@/lib/session';
import { 
  validateSessionDevice,
  generateDeviceFingerprint,
  logSecurityEvent 
} from '@/lib/security';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { authenticated: false, message: 'No session token' },
        { status: 200 }
      );
    }

    const connection = await createConnection();

    try {
      // Clean expired sessions
      await cleanExpiredSessions(connection);

      // Get request headers for device validation
      const headersList = await headers();
      const requestHeaders = {};
      headersList.forEach((value, key) => {
        requestHeaders[key] = value;
      });

      // Create mock request object for device validation
      const mockReq = {
        headers: {
          get: (headerName) => requestHeaders[headerName.toLowerCase()] || null
        },
        ip: requestHeaders['x-forwarded-for'] || requestHeaders['x-real-ip'] || 'unknown'
      };

      // Validate device first
      const deviceValidation = await validateSessionDevice(sessionToken, mockReq);

      if (!deviceValidation.valid) {
        // Log security event and remove compromised session
        await connection.execute(
          'DELETE FROM user_sessions WHERE session_token = ?',
          [sessionToken]
        );
        
        return NextResponse.json(
          { authenticated: false, message: 'Session invalid - possible security breach' },
          { status: 200 }
        );
      }

      // Find session in database
      const [sessions] = await connection.execute(
        `SELECT s.expires_at, s.last_activity, u.email, u.role 
         FROM user_sessions s 
         JOIN users u ON s.user_id = u.id 
         WHERE s.session_token = ?`,
        [sessionToken]
      );

      if (sessions.length === 0) {
        return NextResponse.json(
          { authenticated: false, message: 'Invalid session' },
          { status: 200 }
        );
      }

      const session = sessions[0];

      // Check expiry and inactivity
      const expired = isSessionExpired(session.expires_at);
      const inactive = isSessionInactive(session.last_activity);

      if (expired || inactive) {
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

      // Update last activity
      await connection.execute(
        'UPDATE user_sessions SET last_activity = NOW() WHERE session_token = ?',
        [sessionToken]
      );

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
    // Log error without sensitive information
    console.error('Session check failed');
    return NextResponse.json(
      { authenticated: false, message: 'Session check failed' },
      { status: 200 }
    );
  }
}
