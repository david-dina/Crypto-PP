import { NextResponse } from "next/server";
import { prisma } from "@/libs/prismaDb";
import { lucia} from "@/auth";
import { cookies } from "next/headers";

export const POST = async (req: Request) => {
  const cookie = cookies().get(lucia.sessionCookieName)
  if(!cookie){return NextResponse.json({ message: "User not authenticated" }, { status: 400 });}
  const sessionId = cookie.value
  const {user} = await lucia.validateSession(sessionId);
  if (!user){return NextResponse.json({ message: "User not authenticated" }, { status: 400 });}
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: true,
    },
  });
  fetch('https://api.musicaicentral.com/api/user/email/verify', {
  method: 'POST',
  headers: {
    'Authorization': `${user.aiToken}`,
  },
  // body: JSON.stringify({}), // Optional: include body if needed
})
.then(response => response.json())
.then(data => {
  console.log(data);
})
.catch(err => {
  console.error(err?.message || 'An error occurred');
});
  console.log(user.email, "- FOUND");
  lucia.invalidateUserSessions(user.id)
  lucia.createSession(user.id, {}, { sessionId });
  return new Response("OK", { status: 200 });
};