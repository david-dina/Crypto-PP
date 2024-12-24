"use server";
import { prisma } from "@/libs/prismaDb";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { cache } from "react";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";


const getSongs = cache(async (userId:string) => {
  const allSongs = await prisma.song.findMany({
    where: {
      uploaderId: userId,
      status: "Complete",
    },
    select: {
      visibility: true,
      SongCoverImage: {
        select: {
          url: true,
        },
      },
      title: true,
      id: true,
      explicit: true,
      duration: true,
      played: true,
    },
  });
  const songsData = allSongs.map((song) => ({
    ...song,
    duration: Math.round(song.duration),
    played: song.played.toString(),
    playlistCount: "0",
    logo: `https://ubdclxojnftwcnowsgfr.supabase.co/storage/v1/object/public/images/${song?.SongCoverImage.url}`,
  }));
  const publicSongs = songsData.filter((song) => song.visibility === "Public");
  const privateSongs = songsData.filter((song) => song.visibility === "Private");
  return {
    publicSongs,
    privateSongs,
  };
});

export async function GET(req: Request) {
    const cookie = cookies().get(lucia.sessionCookieName)
    if(!cookie){redirect("/auth/signin");}
    const {user} = await lucia.validateSession(cookie.value);
    if (!user){redirect("/auth/signin")}
    try {
      const songs = await getSongs(user.id);
      return NextResponse.json({ message: "Successful", ...songs }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error fetching songs" }, { status: 400 });
    }
}
