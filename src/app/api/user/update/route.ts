import { prisma } from "@/libs/prismaDb";
import { NextRequest, NextResponse } from "next/server";
import {isAuthorized}from "@/libs/isAuthorized"

export async function POST(request: Request) {
	const body = await request.json();
	const { email, name, phone,username,description } = body;

	const userAuth = await isAuthorized();
    if (!userAuth.user){return NextResponse.json({ message: "Not Authorized" }, { status: 404 });}
    await prisma.user.update({
        where: {
            email: userAuth.user.email.toLowerCase(),
        },
        data:{
            username:username,
            name:name,
            phoneNumber:phone,
            email:email,
        }
    });

	await prisma.profile.update({
        where: {
			profileId:userAuth.user.id
        },
        data:{
            description:description,
        }
    });

    

	const session = await getServerSession(authOptions);
	const updateData: { [key: string]: any } = {};

	const isDemo = session?.user?.email?.includes("demo-");

	if (!session?.user) {
		return new NextResponse(JSON.stringify("User not found!"), { status: 400 });
	}

	if (body === null) {
		return new NextResponse(JSON.stringify("Missing Fields"), { status: 400 });
	}

	if (name) {
		updateData.name = name;
	}

	if (email) {
		updateData.email = email.toLowerCase();
	}

	if (image) {
		updateData.image = image;
	}

	if (isDemo) {
		return new NextResponse(JSON.stringify("Can't update demo user"), {
			status: 401,
		});
	}

	try {
		const user = await prisma.user.update({
			where: {
				email: session?.user?.email as string,
			},
			data: {
				...updateData,
			},
		});

		revalidatePath("/user");

		return NextResponse.json(
			{
				email: user.email,
				name: user.name,
				image: user.image,
			},
			{ status: 200 }
		);

		// return new NextResponse(JSON.stringify("User Updated Successfully!"), {
		// 	status: 200,
		// });
	} catch (error) {
		return new NextResponse("Something went wrong", { status: 500 });
	}
}
