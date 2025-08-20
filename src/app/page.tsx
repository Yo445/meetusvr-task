import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage() {
  // Server-side auth check
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  
  // If user is already authenticated, redirect to dashboard
  if (token) {
    redirect('/dashboard');
  }

  return <LoginForm />;
}