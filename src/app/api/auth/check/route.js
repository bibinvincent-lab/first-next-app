import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken");
    const userEmail = cookieStore.get("userEmail");

    if (!sessionToken || !userEmail) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        email: userEmail.value
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, message: error.message },
      { status: 200 }
    );
  }
}
