import { prisma } from "@/libs/prismaDb";
import { lucia} from "@/auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const GET = async (req: Request) => {
  const params = new URLSearchParams(req.url.split("?")[1]);

  console.log("PARAMS", params);

  const userId = params.get("userId");

  if (userId === null){return new Response("Missing Data", { status: 401 });}
  const userInfo = await prisma.user.findUnique({
      where: {
        id: userId,
        },
        select: {
          id: true,
          password: true,
          username: true,
          name: true,
          email:true,
          avatarUrl: true,
          aiToken: true,
          premium: true,
          emailVerified: true,
          verificationCode:true
        },
  })
  if(!userInfo){return new Response("Invalid user", { status: 401 });}
  if(!userInfo.name){userInfo.name=userInfo.username}
  console.log(userInfo.email, "- CREATED");
  if(userInfo.avatarUrl){
    userInfo.avatarUrl = `https://ubdclxojnftwcnowsgfr.supabase.co/storage/v1/object/public/images/${userInfo.avatarUrl}`
  }
  const ip = req.headers.get("x-real-ip");

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  revalidatePath("/")
  return new Response("OK", { status: 200 });
};
