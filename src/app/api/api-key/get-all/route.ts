import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";
import { authOptions } from "@/libs/auth";

export async function GET() {
	const user = session?.user;

	if (!user) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	try {
		const keys = await prisma.apiKey.findMany({
			where: {
				userId: user.id,
			},
		});
		return new NextResponse(JSON.stringify(keys), { status: 200 });
	} catch (error) {
		return new NextResponse("Something went wrong", { status: 500 });
	}
}
