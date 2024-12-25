import { prisma } from "@/libs/prismaDb"; // Prisma database client
import { lucia } from "@/auth"; // Lucia authentication setup
import { cookies } from "next/headers"; // For cookie handling
import { revalidatePath } from "next/cache"; // Cache invalidation
import bcrypt from "bcrypt"; // For password hashing
import generateRandomString from "@/libs/generateRandomString";

export const POST = async (req: Request) => {
  try {
    // 1. Parse incoming JSON databusinessName,
    const body = await req.json();
    const {username, email, password,category,businessName} = body;

    // 2. Validate required fields
    if (!username || !email || !password || !category ||!businessName) {
      return new Response("All fields are required!", { status: 400 });
    }
    // 3. Check if the username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
      select:{
        username:true
      }
    });
    if (existingUser) {
      return new Response("Username already taken!", { status: 409 });
    }

    // 4. Check if the email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
      select:{
        email:true
      }
    });
    if (existingEmail) {
      return new Response("Email already registered!", { status: 409 });
    }

    // 5. Hash password securely using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create a new user record in the database
    const newUser = await prisma.user.create({
      data: {
        name: `${businessName}`,
        role:"BUSINESS",
        username,
        email,
        password: hashedPassword,
        verificationCode: generateRandomString(), // Store the verification code for email validation
      },
    });
    await prisma.company.create({
        data:{
            name:businessName,
            ownerId:newUser.id,
            category,
            acceptedCoins:[],
            currency:"USD",
        }
    })

    // 7. Generate a new session using Lucia authentication
    const session = await lucia.createSession(newUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    // 8. Set session cookie in the browser
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // 9. Revalidate cache for dynamic pages like dashboard
    revalidatePath("/dashboard"); // Example path for cache invalidation

    // 10. Log successful account creation
    console.log(`${email} - ACCOUNT CREATED`);

    // 11. Return success response with user ID
    return new Response(JSON.stringify({ userId: newUser.id }), {
      status: 201,
      headers: { "Content-Type": "application/json" }, // Set JSON header
    });
  } catch (error) {
    // 12. Handle errors and send server error response
    console.error("Error creating user:", error);
    return new Response(`${error}`, { status: 500 });
  }
};
