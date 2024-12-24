import { NextRequest, NextResponse } from "next/server";
import {isAuthorized}from "@/libs/isAuthorized"
import { prisma } from "@/libs/prismaDb";

export async function GET(req: NextRequest) {
    const userAuth = await isAuthorized();
    if (!userAuth.user){return NextResponse.json({ message: "Not Authorized" }, { status: 404 });}
    const user = await prisma.user.findUnique({
        where: {
            email: userAuth.user.email.toLowerCase(),
        },
        select:{
            username:true,
            name:true,
            email:true,
            id:true,
            avatarUrl:true,
            Profile:{
                select:{
                    twitter:true,
                    tiktok:true,
                    instagram:true,
                    description:true,
                    verified:true,
                }
            }
        }
    });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const combinedUser: any = {
        ...user,
        // Spread Profile attributes into the user object
        ...(user.Profile ?? {}),
    };

    // Remove Profile property if it exists
    delete combinedUser.Profile;

	return NextResponse.json({user:combinedUser}, { status: 200 });
}