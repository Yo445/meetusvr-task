"use client";

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logoutUser } from "@/redux/features/authSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { UserInfo } from "@/lib/types";

type DashboardContentProps = {
  initialData: UserInfo;
};

export default function DashboardContent({
  initialData,
}: DashboardContentProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Use the server-provided data or fall back to Redux state
  const userData = user || initialData;
  console.log(userData);

  function getInitials(name: string) {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  const handleLogout = async () => {
    try {
      const result = await dispatch(logoutUser()).unwrap();
      if (result) {
        window.location.replace("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{getInitials(userData.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Dashboard</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Dashboard Overview</CardTitle>
            <CardDescription>
              Welcome to your personal dashboard. Here you can manage your
              account and view your activity.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* User Information Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <div className="p-6">
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-sm font-medium text-yellow-700 ring-1 ring-inset ring-yellow-700/10">
                  {userData.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Email Address
                </dt>
                <dd className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-sm font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                  {userData.email}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="mt-1 text-lg text-gray-900">{userData.id}</dd>
              </div>
            </dl>
          </div>
        </Card>
      </main>
    </div>
  );
}
