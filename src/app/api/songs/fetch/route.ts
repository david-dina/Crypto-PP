import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";
import { isAuthorized } from "@/libs/isAuthorized";

export async function GET(req: Request) {
  const { user } = await isAuthorized();
    if (!user){return NextResponse.json({ message: "Session Not Valid" }, { status: 401 });}
    const params = new URLSearchParams(req.url.split("?")[1]);
    const songId = params.get("songID");
    if(!songId){return NextResponse.json({ message: "Invalid Song ID" }, { status: 404 });}
    const song = await prisma.song.findUnique({
        where: {
          id: songId,
        },
        select:{
          title:true,
          uploaderId:true,
          createdAt:true,
          explicit:true,
          visibility:true,
          SongCoverImage: {
            select: {
              url: true,
            },
          },
        }
      });
      if (!song) return NextResponse.json({ message: "Invalid Song ID" }, { status: 404 });
      // const processedSong = {
      //   ...song,
      //   duration: Math.round(song.duration),
      //   played: song.played.toString(),
      //   playlistCount: "0",
      //   logo: `https://ubdclxojnftwcnowsgfr.supabase.co/storage/v1/object/public/images/${song.SongCoverImage.url}`,
      // };
      const processedSong = {
           ...song,
           songImage: `https://ubdclxojnftwcnowsgfr.supabase.co/storage/v1/object/public/images/${song.SongCoverImage.url}`,
           createdAt: `${song.createdAt}`
         };
         const { SongCoverImage,uploaderId, ...finalProcessedSong } = processedSong;
         const isOwner = song.uploaderId === user.id

    
      
      // Return the data with both public and private songs
      //console.log(finalProcessedSong)
      return NextResponse.json({
        message: "Successful",
        finalProcessedSong,isOwner
      }, { status: 200 });
}