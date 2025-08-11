"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User, ChevronLeft, ChevronRight } from "lucide-react";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { useRouter } from "next/navigation";
import { useUserDetails } from "@/hooks/useUserDetails";
import { toast } from "sonner";

interface NavbarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const AdminNavBar = ({ isCollapsed, toggleSidebar }: NavbarProps) => {
  const router = useRouter();
  const { logout, isLoggingOut } = useUserDetails();

  const handleLogOut = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      router.push("/");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="h-16 border-b bg-white px-4">
      <div className="flex h-16 items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="transition-all duration-200 ease-in-out"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-6 w-6" />
            <span className="text-sm font-medium">Admin</span>
          </div>
          <ConfirmModal
            variant="logout"
            onConfirm={handleLogOut}
            disabled={isLoggingOut}
            description="Are you sure you want to log out? You will need to sign in again to access the dashboard."
            header="Log Out"
          >
            <Button variant="ghost" size="icon" disabled={isLoggingOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </ConfirmModal>
        </div>
      </div>
    </div>
  );
};

export default AdminNavBar;
