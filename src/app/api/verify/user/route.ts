import { NextResponse } from "next/server";
import { prisma } from "@/libs/prismaDb";
import { lucia } from "@/auth";
import { cookies } from "next/headers";

export const POST = async (req: Request) => {
  try {
    // Get session cookie
    const cookie = cookies().get(lucia.sessionCookieName);
    if (!cookie) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 400 });
    }

    const sessionId = cookie.value;

    // Validate session
    const { user } = await lucia.validateSession(sessionId);
    if (!user) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 400 });
    }

    // Update user verification
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    console.log(user.email, "- UPDATED");

    // Invalidate and create new session
    await lucia.invalidateUserSessions(user.id);
    await lucia.createSession(user.id, {}, { sessionId });

    // Return JSON response instead of a raw Response
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
