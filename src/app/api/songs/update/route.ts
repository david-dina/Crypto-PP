import { prisma } from "@/libs/prismaDb";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const cookie = cookies().get(lucia.sessionCookieName)
    if(!cookie){return NextResponse.json({ message: "User not authenticated" }, { status: 401 });}
    const sessionId = cookie.value
    const {user} = await lucia.validateSession(sessionId);
    if (!user){return NextResponse.json({ message: "Session Not Valid" }, { status: 401 });}
    const params = new URLSearchParams(req.url.split("?")[1]);
    const songId = params.get("songID");
    if(!songId){return NextResponse.json({ message: "Invalid Song ID" }, { status: 400 });}
    const song = await prisma.song.findUnique({
        where: {
          id: songId,
        },
        select:{
          uploaderId:true,
        }
      });
      if (!song) return NextResponse.json({ message: "Invalid Song ID" }, { status: 400 });
      if(user.id !== song?.uploaderId){return NextResponse.json({ message: "User not authorized" }, { status: 401 });}

      const requestBody = await req.json();
    const { title, explicit, visibility } = requestBody;
    if (!title || !explicit || !visibility){ return NextResponse.json({ message: "Missing Data" }, { status: 400 })}
    await prisma.song.update({
        where:{
            id:songId
        },
        data:{
        title:title,
        explicit:explicit,
        visibility:visibility
        }
      })
      return NextResponse.json({
        message: "Successful"
      }, { status: 200 });
}