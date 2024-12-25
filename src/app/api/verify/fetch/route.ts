import { NextResponse } from "next/server";
import { lucia } from "@/auth";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    // 1. Retrieve the session cookie
    const cookie = cookies().get(lucia.sessionCookieName);

    // 2. Check if the cookie exists
    if (!cookie) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    // 3. Validate the session using Lucia
    const sessionId = cookie.value;
    const { user, session } = await lucia.validateSession(sessionId);

    // 4. Handle invalid or expired sessions
    if (!user || !session) {
      return NextResponse.json(
        { message: "Invalid or expired session" },
        { status: 401 }
      );
    }

    // 5. Log for debugging purposes
    console.log(`${user.email} - FOUND`);

    // 6. Return user verification data
    return NextResponse.json(
      {
        verificationCode: user.verificationCode,
        email: user.email,
        emailVerified: user.emailVerified,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error verifying user:", e);

    // 7. Handle server errors
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
