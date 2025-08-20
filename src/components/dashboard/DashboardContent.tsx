'use client';

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

export default function DashboardContent({ initialData }: DashboardContentProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  // Use the server-provided data or fall back to Redux state
  const userData = user || initialData;
  
  function getInitials(name: string) {
    if (!name) return '';
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
        // First clear any cached data
        if (typeof window !== 'undefined') {
          // Clear any client-side storage if needed
          document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          document.cookie = 'user_info=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        }
        // Use window.location.replace for a clean redirect that prevents back navigation
        window.location.replace('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // You might want to show an error message to the user here
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
                <AvatarFallback>
                  {getInitials(userData.name)}
                </AvatarFallback>
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
      </main>
    </div>
  );
}
