"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaShieldAlt, FaSignOutAlt, FaKey } from "react-icons/fa";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SettingsPage = () => {
  const { user, logout, isLoggingOut } = useAuth();
  const { fetchData, loading: passwordLoading } = useApi();

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string>("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    try {
      await fetchData("/auth/change-password", {
        method: "PUT",
        data: {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
      });

      // Clear form on success
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password changed successfully!");
    } catch (error: any) {
      setPasswordError(error?.message || "Failed to change password");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return "Not available";
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-gray-500">Please log in to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaUser className="text-blue-600" />
              Account Information
            </CardTitle>
            <CardDescription>
              Your account details and profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <FaUser className="text-gray-400" />
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm text-gray-600">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaEnvelope className="text-gray-400" />
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-center gap-3">
                <FaPhone className="text-gray-400" />
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-gray-600">{user.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-gray-400" />
              <div>
                <Label className="text-sm font-medium">Role</Label>
                <div className="mt-1">
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaCalendar className="text-gray-400" />
              <div>
                <Label className="text-sm font-medium">Member Since</Label>
                <p className="text-sm text-gray-600">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${user.verified ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <Label className="text-sm font-medium">Email Verified</Label>
                <p className="text-sm text-gray-600">
                  {user.verified ? "Verified" : "Not Verified"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaKey className="text-green-600" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {passwordError && (
                <Alert variant="destructive">
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={passwordLoading}
              >
                {passwordLoading ? "Changing Password..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Logout Section */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <FaSignOutAlt />
            Account Actions
          </CardTitle>
          <CardDescription>
            Sign out of your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sign Out</p>
              <p className="text-sm text-gray-600">
                You will be logged out of your account and redirected to the login page.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Signing Out..." : "Sign Out"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Toaster />
    </div>
  );
};

export default SettingsPage;
