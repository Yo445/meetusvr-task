import { redirect } from "next/navigation";

async function getUser() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/user`,
    { cache: "no-store" }
  );
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to load user");
  return res.json();
}

export default async function DashboardPage() {
  const user = await getUser();
  
  // Redirect if no user is found
  if (!user) {
    redirect("/");
  }

  async function logout() {
    "use server";
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/logout`, {
      method: "POST"
    });
    redirect("/");
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl">
        <div className="glass rounded-2xl p-8">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="mt-4 text-black/70">
            Welcome, <span className="font-medium">{user.name}</span>
          </p>
          <p className="mt-1 text-sm text-black/60">
            Your ID: <span className="font-mono">{user.id}</span>
          </p>

          <form action={logout} className="mt-8">
            <button className="btn btn-primary">Logout</button>
          </form>
        </div>
      </div>
    </main>
  );
}
