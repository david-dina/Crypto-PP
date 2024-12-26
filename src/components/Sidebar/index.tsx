"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";

// Sidebar Props
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

// -----------------------------
// Menu Groups (with icons)
// -----------------------------
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

const businessMenuGroups = [
  {
    name: "",
    menuItems: [
      {
        icon: <span className="icon-[fluent--home-12-regular] h-6 w-6"></span>,
        label: "Business Menu",
        route: "#",
        children: [
          {
            label: "Dashboard",
            route: "/dashboard",
          },
          {
            label: "Plans",
            route: "/dashboard/business/plans",
          },
          {
            label: "Invoices",
            route: "/dashboard/business/invoices",
          },
          {
            label: "Analytics",
            route: "/dashboard/business/analytics",
          },
          {
            label: "Settings",
            route: "/dashboard/business/settings",
          },
        ]
      },
      {
        icon: <span className="icon-[mdi--transfer] h-6 w-6"></span>,
        label: "Wallet Management",
        route: "#",
        children: [
          {
            label: "Wallets",
            route: "/business/wallets",
          },
          {
            label: "Transactions",
            route: "/business/transactions",
          }
        ]
      },
      {
        icon: <span className="icon-[mdi--file-document-outline] h-6 w-6"></span>,
        label: "Reports & Compliance",
        route: "#",
        children: [
          {
            label: "Reports",
            route: "/business/reports",
          },
          {
            label: "Tax Compliance",
            route: "/business/tax",
          },
        ]
      },
      {
        icon: <span className="icon-[mdi--help-circle-outline] h-6 w-6"></span>,
        label: "Support",
        route: "#",
        children: [
          {
            label: "Help Center",
            route: "/business/help",
          },
          {
            label: "Contact Support",
            route: "/business/support",
          },
        ]
      },
    ],
  },
];



// -----------------------------
// Sidebar Component
// -----------------------------
const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  // -----------------------------
  // States
  // -----------------------------
  const [role, setRole] = useState<string>("USER"); // Default to 'USER'
  const [menuGroups, setMenuGroups] = useState(userMenuGroups);
  const [pageName, setPageName] = useState("dashboard");

  // -----------------------------
  // Fetch Role from API
  // -----------------------------
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await fetch("/api/user/hydrate");
        if (response.ok) {
          const data = await response.json();
          console.log(data.user)
          const userRole = data.user.role || "USER";

          setRole(userRole); // Set role
          setMenuGroups(userRole === "BUSINESS" ? businessMenuGroups : userMenuGroups);
        }
      } catch (error) {
        console.error("Failed to fetch role:", error);
      }
    };

    fetchRole();
  }, []);

  // -----------------------------
  // Sidebar Render
  // -----------------------------
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

        {/* Sidebar Menu */}
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-1 px-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
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

export default Sidebar;
