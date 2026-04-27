import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;
    const offset = (page - 1) * limit;

    const db = await createConnection();
    const [users] = await db.query("SELECT * FROM test ORDER BY rollno LIMIT ? OFFSET ?", [limit, offset]);
    const [totalResult] = await db.query("SELECT COUNT(*) as total FROM test");
    const total = totalResult[0].total;

    return NextResponse.json({ users, total, page, limit });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST
export async function POST(req) {
  try {
    const data = await req.json();
    const { rollno, name, email, phoneno, age } = data;

    // Validation
    if (!rollno || !name || !email || !phoneno || age === undefined) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (isNaN(age) || age < 0 || age > 150) {
      return NextResponse.json(
        { success: false, error: "Invalid age" },
        { status: 400 }
      );
    }

    const db = await createConnection();
    const [result] = await db.execute(
      "INSERT INTO test (rollno, name, email, phoneno, age) VALUES (?, ?, ?, ?, ?)",
      [rollno, name, email, phoneno, age]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// UPDATE (Edit)
export async function PUT(req) {
  try {
    const data = await req.json();
    const { rollno, name, email, phoneno, age } = data;

    if (!rollno) {
      return NextResponse.json(
        { success: false, error: "rollno is required" },
        { status: 400 }
      );
    }

    // Validation
    if (!name || !email || !phoneno || age === undefined) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (isNaN(age) || age < 0 || age > 150) {
      return NextResponse.json(
        { success: false, error: "Invalid age" },
        { status: 400 }
      );
    }

    const db = await createConnection();

    const [result] = await db.execute(
      `UPDATE test 
       SET name = ?, email = ?, phoneno = ?, age = ?
       WHERE rollno = ?`,
      [name, email, phoneno, age, rollno]
    );

    return NextResponse.json({
      success: true,
      affectedRows: result.affectedRows,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

//Delete
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const rollno = searchParams.get("rollno");

    if (!rollno) {
      return NextResponse.json({ success: false, error: "No id provided" }, { status: 400 });
    }

    const db = await createConnection();
    await db.execute("DELETE FROM test WHERE rollno = ?", [rollno]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}