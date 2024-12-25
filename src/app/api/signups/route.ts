import { prisma } from "@/libs/prismaDb";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
  try {
    // Parse incoming data
    const body = await req.json();
    const { name, username, email, password,code } = body;

    // Validation
    if (!name || !username || !email || !password || !code) {
      return new Response("All fields are required!", { status: 400 });
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return new Response("Username already taken!", { status: 409 });
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return new Response("Email already registered!", { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        verificationCode:code
      },
    });

    // Create session
    const session = await lucia.createSession(newUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    revalidatePath("/");

    console.log(`${email} - ACCOUNT CREATED`);

    // Return user ID in response
    return new Response(JSON.stringify({ userId: newUser.id }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong!", { status: 500 });
  }
};

