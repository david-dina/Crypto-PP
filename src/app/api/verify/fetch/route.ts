import { NextResponse } from "next/server";
import { lucia } from "@/auth";
import { cookies } from "next/headers";

export const GET = async (req: Request) => {
  try{
  // Get the session cookie
  const cookie = cookies().get(lucia.sessionCookieName);

  // Check if the cookie is present
  if (!cookie) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 400 });
  
  }

  // Validate the session
  const sessionId = cookie.value;
  const { user } = await lucia.validateSession(sessionId);

  // Check if the user is valid
  if (!user) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 400 });
  }

  // Log user email
  console.log(user.email, "- FOUND");

  // Return user data
  return NextResponse.json({
      verificationCode: user.verificationCode,
      email: user.email,
      emailVerified: user.emailVerified,
    },
    {status: 200});}
  catch(e){
    console.log(e)
    return new NextResponse("ERRORED OUT", { status: 400 });

  }
};