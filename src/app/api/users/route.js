import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';
import { validateUserData, sanitizeSearchParams } from '@/lib/validation';
import { cookies } from 'next/headers';
import { isSessionExpired, isSessionInactive } from '@/lib/session';

// Authenticate the request by validating the session token against the database
async function authenticateRequest() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('sessionToken')?.value;

  if (!sessionToken) {
    return { authenticated: false, status: 401, message: 'Authentication required' };
  }

  const connection = await createConnection();
  try {
    const [sessions] = await connection.execute(
      `SELECT s.expires_at, s.last_activity, u.email, u.role
       FROM user_sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.session_token = ?`,
      [sessionToken]
    );

    if (sessions.length === 0) {
      return { authenticated: false, status: 401, message: 'Invalid session' };
    }

    const session = sessions[0];

    if (isSessionExpired(session.expires_at) || isSessionInactive(session.last_activity)) {
      await connection.execute(
        'DELETE FROM user_sessions WHERE session_token = ?',
        [sessionToken]
      );
      return { authenticated: false, status: 401, message: 'Session expired' };
    }

    await connection.execute(
      'UPDATE user_sessions SET last_activity = NOW() WHERE session_token = ?',
      [sessionToken]
    );

    return { authenticated: true, user: { email: session.email, role: session.role } };
  } finally {
    connection.release();
  }
}

// GET
export async function GET(req) {
  try {
    const auth = await authenticateRequest();
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: auth.message },
        { status: auth.status }
      );
    }

    const { searchParams } = new URL(req.url);
    const sanitizedParams = sanitizeSearchParams(searchParams);
    
    const page = sanitizedParams.page || 1;
    const limit = Math.min(sanitizedParams.limit || 5, 100);
    const offset = (page - 1) * limit;

    const db = await createConnection();
    try {
      const [users] = await db.query("SELECT rollno, name, email, phoneno, age FROM test ORDER BY rollno LIMIT ? OFFSET ?", [limit, offset]);
      const [totalResult] = await db.query("SELECT COUNT(*) as total FROM test");
      const total = totalResult[0].total;

      return NextResponse.json({ users, total, page, limit });
    } finally {
      db.release();
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST
export async function POST(req) {
  try {
    const auth = await authenticateRequest();
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: auth.message },
        { status: auth.status }
      );
    }

    const data = await req.json();
    
    const validation = validateUserData(data);
    
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    const { sanitized } = validation;

    const db = await createConnection();
    try {
      const [result] = await db.execute(
        "INSERT INTO test (rollno, name, email, phoneno, age) VALUES (?, ?, ?, ?, ?)",
        [sanitized.rollno, sanitized.name, sanitized.email, sanitized.phoneno, sanitized.age]
      );

      return NextResponse.json({ success: true, id: result.insertId });
    } finally {
      db.release();
    }
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ success: false, error: "Duplicate entry" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// UPDATE (Edit)
export async function PUT(req) {
  try {
    const auth = await authenticateRequest();
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: auth.message },
        { status: auth.status }
      );
    }

    const data = await req.json();
    const { rollno, name, email, phoneno, age } = data;

    if (!rollno) {
      return NextResponse.json(
        { success: false, error: "Roll number is required" },
        { status: 400 }
      );
    }

    const validation = validateUserData({ rollno, name, email, phoneno, age });
    
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    const { sanitized } = validation;

    const db = await createConnection();
    try {
      const [result] = await db.execute(
        `UPDATE test 
         SET name = ?, email = ?, phoneno = ?, age = ?
         WHERE rollno = ?`,
        [sanitized.name, sanitized.email, sanitized.phoneno, sanitized.age, sanitized.rollno]
      );

      return NextResponse.json({
        success: true,
        affectedRows: result.affectedRows,
      });
    } finally {
      db.release();
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete
export async function DELETE(req) {
  try {
    const auth = await authenticateRequest();
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: auth.message },
        { status: auth.status }
      );
    }

    const { searchParams } = new URL(req.url);
    const sanitizedParams = sanitizeSearchParams(searchParams);
    const rollno = sanitizedParams.rollno;

    if (!rollno) {
      return NextResponse.json({ success: false, error: "Roll number is required" }, { status: 400 });
    }

    const db = await createConnection();
    try {
      const [result] = await db.execute("DELETE FROM test WHERE rollno = ?", [rollno]);

      return NextResponse.json({ 
        success: true, 
        affectedRows: result.affectedRows 
      });
    } finally {
      db.release();
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}