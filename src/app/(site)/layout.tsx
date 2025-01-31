"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import ToastContext from "../context/ToastContext";

// Type for Children
interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <SessionProvider>
      <ToastContext />
        {children}
      <ToastContext />
    </SessionProvider>
  );
};

export default RootLayout;
