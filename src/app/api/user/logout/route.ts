import { NextRequest, NextResponse } from "next/server";
import {isAuthorized}from "@/libs/isAuthorized"
import { cookies } from "next/headers";
import { lucia } from "@/auth";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
	const {user,session} = await isAuthorized();
    if (!user || !session){return NextResponse.json({ message: "Not Authorized" }, { status: 404 });}
    await lucia.invalidateSession(session.id);
    const sessions = await lucia.getUserSessions(user.id);
    const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    revalidatePath("/")
    return NextResponse.json({ message: "Successfull" }, { status: 200 });
}