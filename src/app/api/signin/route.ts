"use server";
import { prisma } from "@/libs/prismaDb";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { compare } from 'bcrypt';
import { revalidatePath } from "next/cache";

export async function GET(req: Request) {
  const params = new URLSearchParams(req.url.split("?")[1]);
  const email = params.get("email");
  const password = params.get("password");

  if (!email || !password) {
    return new Response("Missing credentials", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
    select: {
      id: true,
      password: true,
      username: true,
      emailVerified: true,
    },
  });

  if (!user) {
    return new Response("Invalid User", { status: 401 });
  }

  const isPasswordCorrect = await compare(password, user.password);
  if (!isPasswordCorrect) {
    return new Response("Incorrect Password", { status: 401 });
  }

  console.log("FOUND", user.username);

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  revalidatePath("/")
  if (!user.emailVerified) {
    return new Response("Email not verified", { status: 201 });
  }
  return new Response("Login successful", { status: 200 });
}
