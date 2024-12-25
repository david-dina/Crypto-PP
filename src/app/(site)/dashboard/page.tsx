import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";

// Import Dashboards
import UserDashboard from "./user/page";
import BusinessDashboardOverview from "./business/page";
//import AdminDashboard from "./dashboard/admin/page"; // Import Admin Dashboard

// Import Lucia Auth and Prisma
import { lucia } from "@/auth";
import { prisma } from "@/libs/prismaDb";
import { cookies } from "next/headers";

// Metadata for SEO
export const metadata: Metadata = {
  title: "Crypto Payments Dashboard",
  description: "Dashboard for managing subscriptions, payments, and analytics.",
};

// Define Dashboard Page
export default async function DashboardPage() {
  let role = "USER"; // Default role

  try {
    // Authenticate User with Lucia
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (sessionId) {
      // Validate session and fetch user details
      const { user } = await lucia.validateSession(sessionId);

      if (user) {
        // Fetch user data from Prisma for role
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id }, // Match Lucia session ID
          select: { role: true }, // Only fetch the 'role'
        });

        // If user exists, update the role
        if (dbUser) {
          role = dbUser.role; // Set role to USER, BUSINESS, or ADMIN
        }
      }else{

      }
    }
  } catch (error) {
    console.error("Authentication Error:", error);
  }

  // Render dashboard based on the role
  return (
    <DefaultLayout>
      {role === "BUSINESS" ? (
        <BusinessDashboardOverview/>
      ) : role === "ADMIN" ? (
        <UserDashboard/>
      ) : (
        <UserDashboard />
      )}
    </DefaultLayout>
  );
}
