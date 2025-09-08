"use client";

import React, { useState, useEffect } from "react";
import AdminNavBar from "@/components/shared/AdminNavBar";
import AdminSidebar from "@/components/shared/AdminSidebar";
import { useUserDetails } from "@/hooks/useUserDetails";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loading, isAdmin, user } = useUserDetails();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're not loading AND we have confirmed the user is not an admin
    if (!loading && user !== null && !isAdmin()) {
      router.push("/");
    }
  }, [loading, isAdmin, router, user]);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Don't render admin layout if user is not an admin
  if (!isAdmin()) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavBar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        <main className="flex-1 bg-gray-50 p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
