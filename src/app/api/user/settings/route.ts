import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/libs/isAuthorized";
import { prisma } from "@/libs/prismaDb";

export async function GET(req: NextRequest) {
  // Authorization
  const userAuth = await isAuthorized();
  if (!userAuth.user) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 404 });
  }

  // Fetch user and business details
  const user = await prisma.user.findUnique({
    where: {
      email: userAuth.user.email.toLowerCase(),
    },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      avatarUrl: true,
      role: true,
      phoneNumber: true,
      // Include business details if user is a BUSINESS
      Company: userAuth.user.role === "BUSINESS" && {
        select: {
          id: true,
          name: true,
          taxID: true,
          currency: true,
          restrictedRegions: true,
          taxRate: true,
          taxComplianceNote: true,
        },
      },
    },
  });

  // Handle user not found
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const userAuth = await isAuthorized();
  if (!userAuth.user) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 404 });
  }

  try {
    const body = await req.json();

    // Update user profile fields
    const updatedUser = await prisma.user.update({
      where: { email: userAuth.user.email.toLowerCase() },
      data: {
        name: body.name,
        email: body.email,
        username: body.username,
        phoneNumber: body.phone,
      },
    });

    // Update business-specific fields if the user is a BUSINESS
    let updatedCompany = null;
    if (userAuth.user.role === "BUSINESS") {
      updatedCompany = await prisma.company.update({
        where: { ownerId: updatedUser.id },
        data: {
          name: body.companyName,
          taxID: body.taxID,
          restrictedRegions: body.restrictedRegions || [],
          taxRate: body.taxRate ? parseFloat(body.taxRate) : null,
          taxComplianceNote: body.taxComplianceNote || null,
        },
      });
    }

    return NextResponse.json(
      { user: updatedUser, company: updatedCompany },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json(
      { message: "Failed to update settings" },
      { status: 500 }
    );
  }
}
