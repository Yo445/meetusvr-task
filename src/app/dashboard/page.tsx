import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { API_URL } from "@/constant";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  
  if (!token) {
    redirect('/');
  }

  try {
    const res = await fetch(`${API_URL}/user/info`, {
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      next: { tags: ['user'] }, // For revalidation
    });

    if (!res.ok) {
      if (res.status === 401) {
        redirect('/');
      }
      throw new Error('Failed to fetch user data');
    }

    const userData = await res.json();

    // Pass the pre-fetched user data to the client component
    return <DashboardContent initialData={userData} />;
  } catch (error) {
    console.error('Error fetching user data:', error);
    redirect('/');
  }
}
