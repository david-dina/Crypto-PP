import { NextResponse } from "next/server";
import { isAuthorized } from "@/libs/isAuthorized";

export async function GET(req: Request) {
  const { user } = await isAuthorized();
    if (!user){return NextResponse.json({ owner:false }, { status: 200 });}
    const params = new URLSearchParams(req.url.split("?")[1]);
    const userId = params.get("userID");
    if(!userId){return NextResponse.json({ message: "Invalid Request" }, { status: 400 });}
    const owner = (userId === user.id)
      return NextResponse.json({
        owner: owner,
      }, { status: 200 });
}