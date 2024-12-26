"use server";

import React from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";

// Lucia and Prisma Imports
import { lucia } from "@/auth";
import { prisma } from "@/libs/prismaDb";

// Sidebar Props
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

// ----------------------------
// User Menu Groups
const userMenuGroups = [
  {
    name: "User Menu",
    menuItems: [
      {
        icon: <span className="icon-[fluent--home-12-regular] h-6 w-6"></span>,
        label: "Dashboard",
        route: "/dashboard",
      },
      {
        icon: <span className="icon-[tabler--wallet] h-6 w-6"></span>,
        label: "Wallets",
        route: "/wallets",
      },
      {
        icon: <span className="icon-[fa6-solid--chart-line] h-6 w-6"></span>,
        label: "Transactions",
        route: "/transactions",
      },
      {
        icon: <span className="icon-[mdi--library-books] h-6 w-6"></span>,
        label: "Subscriptions",
        route: "/subscriptions",
      },
      {
        icon: <span className="icon-[ri--settings-4-line] h-6 w-6"></span>,
        label: "Settings",
        route: "/dashboard/settings",
      },
    ],
  },
];

// ----------------------------
// Business Menu Groups
const businessMenuGroups = [
  {
    name: "Business Menu",
    menuItems: [
      {
        icon: <span className="icon-[fluent--home-12-regular] h-6 w-6"></span>,
        label: "Dashboard",
        route: "/business/dashboard",
      },
      {
        icon: <span className="icon-[mdi--notebook] h-6 w-6"></span>,
        label: "Plans",
        route: "/business/plans",
      },
      {
        icon: <span className="icon-[mdi--receipt-text] h-6 w-6"></span>,
        label: "Invoices",
        route: "/business/invoices",
      },
      {
        icon: <span className="icon-[fa6-solid--chart-line] h-6 w-6"></span>,
        label: "Analytics",
        route: "/business/analytics",
      },
      {
        icon: <span className="icon-[ri--settings-4-line] h-6 w-6"></span>,
        label: "Settings",
        route: "/business/settings",
      },
    ],
  },
];

// ----------------------------
// Server-Side Function to Fetch Role
const fetchUserRole = async (): Promise<string> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) return "USER"; // Default role if no session

  const { user } = await lucia.validateSession(sessionId);

  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    return dbUser?.role || "USER"; // Default to 'USER' if no role is found
  }

  return "USER"; // Default role
};

// ----------------------------
// Sidebar Component
const BusinessSidebar = async ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  // Get Role
  const role = await fetchUserRole();

  // Determine Menu Groups
  const menuGroups = role === "BUSINESS" ? businessMenuGroups : userMenuGroups;

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0 duration-300 ease-linear"
            : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
          <Link href="/">
            <Image
              width={195}
              height={40}
              src={"/images/logo/logo-dark.svg"}
              alt="Logo"
              priority
              className="dark:hidden"
            />
            <Image
              width={195}
              height={40}
              src={"/images/logo/logo.svg"}
              alt="Logo"
              priority
              className="hidden dark:block"
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-1 px-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={menuItem.route}
                      setPageName={() => {}}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default BusinessSidebar;
