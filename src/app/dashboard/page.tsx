import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getAuthCookie } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Settings, Activity } from "lucide-react";

async function getUser() {
  try {
    const token = await getAuthCookie();
    if (!token) {
      return null;
    }

    // Try to get user from stored cookie first
    const cookieStore = await cookies();
    const userInfoStr = cookieStore.get("user_info")?.value;

    if (userInfoStr) {
      try {
        return JSON.parse(userInfoStr);
      } catch (e) {
        console.error("Failed to parse user info from cookie");
      }
    }

    // Fallback to API call if cookie parsing fails
    const res = await fetch(
      "https://api-yeshtery.dev.meetusvr.com/v1/user/info",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) {
      if (res.status === 401) return null;
      throw new Error("Failed to load user");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const user = await getUser();

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }
  // Redirect if no user is found
  if (!user) {
    redirect("/");
  }

  async function logout() {
    "use server";

    const cookieStore = await cookies();
    const cookieNames = ["access_token", "refresh_token", "user_info"];

    // Clear all auth-related cookies
    for (const name of cookieNames) {
      cookieStore.delete(name);
    }

    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Dashboard</p>
              </div>
            </div>
            <form action={logout}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </form>
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
