import { prisma } from "@/libs/prismaDb";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return new Response("Missing username", { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
    select:{
        username:true
    }
  });

  return new Response(
    JSON.stringify({ available: !existingUser }),
    { status: 200 }
  );
};
