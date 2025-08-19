'use client';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import create from 'zustand';

// ---- Zustand store to hold basic auth state on client
type User = { id: string | number; name: string } | null;
interface AuthState { user: User; setUser: (u: User) => void }
export const useAuthStore = create<AuthState>((set) => ({ user: null, setUser: (u) => set({ user: u }) }));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = useMemo(() => EMAIL_RE.test(email) && password.length > 0, [email, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!valid) return;
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || 'Login failed');
      }
      // Optional: immediately fetch user info to show name on dashboard without reload
      const ui = await fetch('/api/user');
      if (ui.ok) {
        const data = await ui.json();
        setUser({ id: data.id, name: data.name });
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* Left: form */}
        <section className="flex items-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            <h1 className="text-5xl font-semibold tracking-tight text-black/80">Welcome back</h1>
            <p className="mt-4 text-black/60">Step into our shopping metaverse for an unforgettable shopping experience</p>

            <form onSubmit={onSubmit} className="mt-10 space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"><Mail size={18} /></span>
                <input
                  className="input pl-10"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  type="email"
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"><Lock size={18} /></span>
                <input
                  className="input pl-10"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  type="password"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button type="submit" disabled={!valid || loading} className="btn btn-primary w-full">
                {loading ? 'Logging in…' : 'Login'}
              </button>

              <p className="text-center text-xs text-black/50">Don&apos;t have an account? <span className="underline">Sign up</span></p>
            </form>
          </div>
        </section>

        {/* Right: artwork */}
        <section className="relative hidden items-center justify-center lg:flex">
          <div className="relative h-[60vh] w-[60vh]">
            <Image
              src="/meetusvr-ring.svg"
              alt="MeetusVR ring"
              fill
              priority
              className="object-contain drop-shadow-xl"
            />
          </div>
          <div className="absolute bottom-16 text-5xl font-semibold tracking-wider text-black/70">meetus<span className="font-normal">VR</span></div>
        </section>
      </div>
    </main>
  );
}



