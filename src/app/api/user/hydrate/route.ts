import { NextRequest, NextResponse } from "next/server";
import {isAuthorized}from "@/libs/isAuthorized"

export async function GET(req: NextRequest) {
    const {user} = await isAuthorized();
    if (!user){return NextResponse.json({ message: "Not Authorized" }, { status: 501 });}
	return NextResponse.json({user}, { status: 200 });
}