import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';
import { validateUserData, sanitizeSearchParams } from '@/lib/validation';

// GET
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sanitizedParams = sanitizeSearchParams(searchParams);
    
    const page = sanitizedParams.page || 1;
    const limit = Math.min(sanitizedParams.limit || 5, 100); // Cap at 100
    const offset = (page - 1) * limit;

    const db = await createConnection();
    const [users] = await db.query("SELECT rollno, name, email, phoneno, age FROM test ORDER BY rollno LIMIT ? OFFSET ?", [limit, offset]);
    const [totalResult] = await db.query("SELECT COUNT(*) as total FROM test");
    const total = totalResult[0].total;

    return NextResponse.json({ users, total, page, limit });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST
export async function POST(req) {
  try {
    const data = await req.json();
    
    // Validate and sanitize all input data
    const validation = validateUserData(data);
    
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    const { sanitized } = validation;

    const db = await createConnection();
    const [result] = await db.execute(
      "INSERT INTO test (rollno, name, email, phoneno, age) VALUES (?, ?, ?, ?, ?)",
      [sanitized.rollno, sanitized.name, sanitized.email, sanitized.phoneno, sanitized.age]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    // Don't expose detailed error messages
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ success: false, error: "Duplicate entry" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// UPDATE (Edit)
export async function PUT(req) {
  try {
    const data = await req.json();
    const { rollno, name, email, phoneno, age } = data;

    if (!rollno) {
      return NextResponse.json(
        { success: false, error: "Roll number is required" },
        { status: 400 }
      );
    }

    // Validate and sanitize input data
    const validation = validateUserData({ rollno, name, email, phoneno, age });
    
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    const { sanitized } = validation;

    const db = await createConnection();

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
    const { searchParams } = new URL(req.url);
    const sanitizedParams = sanitizeSearchParams(searchParams);
    const rollno = sanitizedParams.rollno;

    if (!rollno) {
      return NextResponse.json({ success: false, error: "Roll number is required" }, { status: 400 });
    }

    const db = await createConnection();
    const [result] = await db.execute("DELETE FROM test WHERE rollno = ?", [rollno]);

    return NextResponse.json({ 
      success: true, 
      affectedRows: result.affectedRows 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}