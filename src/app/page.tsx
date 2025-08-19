'use client';
import React, { useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import { GradientCircle } from "@/components/custom/GradientCircle";
import { InputField } from "@/components/custom/InputField";
import { Lock, Mail } from "@/assets/icons/icons";
import { create } from 'zustand';
import Image from 'next/image';

// ---- Zustand store to hold basic auth state on client
type User = { id: string | number; name: string } | null;
interface AuthState { user: User; setUser: (u: User) => void }
export const useAuthStore = create<AuthState>((set) => ({ user: null, setUser: (u) => set({ user: u }) }));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function DesignElements() {
  return (
    <div className="hidden lg:flex absolute h-full right-0 top-0 w-[45%] items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-[800px] aspect-square flex flex-col items-center justify-center px-8">
        {/* Main ring logo */}
        <div className="relative w-full aspect-square">
          <Image
            src="/meetusvr-ring.svg"
            alt="MeetusVR ring"
            fill
            priority
            className="object-contain drop-shadow-2xl"
          />
        </div>
        
        {/* MeetusVR Logo */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <Image
            src="/meetusvr-word-logo.svg"
            alt="MeetusVR"
            width={200}
            height={48}
            className="drop-shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = useMemo(() => EMAIL_RE.test(email) && password.length > 0, [email, password]);

  async function handleSubmit(e: React.FormEvent) {
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
      const ui = await fetch('/api/user');
      if (ui.ok) {
        const data = await ui.json();
        setUser({ id: data.id, name: data.name });
      }
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative h-full w-full lg:w-[55%] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-[440px] flex flex-col gap-6 sm:gap-8 items-center">
        <div className="text-center w-full">
          <h1 className="text-[#1a1a1e] text-3xl sm:text-4xl lg:text-5xl font-medium mb-3 leading-tight">
            Welcome back
          </h1>
          <p className="text-[#62626b] text-sm sm:text-base lg:text-lg leading-relaxed max-w-[90%] mx-auto">
            Step into our shopping metaverse for an unforgettable shopping experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <InputField
            icon={<Mail className="w-5 h-5"/>}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(value) => {
              setEmail(value);
              setError(null);
            }}
          />
          <InputField
            icon={<Lock className="w-5 h-5"/>}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setError(null);
            }}
          />

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={!valid || loading}
            className="bg-[#9414ff] hover:bg-[#8312e6] transition-colors duration-200 relative rounded-lg shrink-0 w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-row items-center justify-center relative size-full">
              <div className="box-border content-stretch flex gap-1 items-center justify-center px-5 py-3 relative w-full">
                <div className="font-['ABeeZee:Regular',_sans-serif] leading-normal not-italic text-[#ffffff] text-[16px]">
                  {loading ? 'Logging in…' : 'Login'}
                </div>
              </div>
            </div>
          </button>
        </form>

        <p className="text-[14px] text-[#62626b] font-['ABeeZee:Regular',_sans-serif] hover:text-[#1a1a1e] transition-colors duration-200 cursor-pointer">
          Don't have an account? <span className="underline">Sign up</span>
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <div className="bg-gradient-to-br from-[#f0f2ff] via-[#f5f0ff] to-[#fff0f9] relative min-h-screen h-full w-full overflow-hidden">
      {/* Background gradient circles with increased blur for smoothness */}
      <GradientCircle
        className="absolute left-[-5%] size-[90vh] top-[-20vh] opacity-80"
        color="#9E77F6"
        radius={1203.5}
        blur={500}
      />
      <GradientCircle
        className="absolute left-[-10%] size-[95vh] bottom-[-30vh] opacity-70"
        color="#B0D2E5"
        radius={1206.5}
        blur={500}
      />
      <GradientCircle
        className="absolute size-[80vh] bottom-[-20vh] right-[-10%] opacity-80"
        color="#9E77F6"
        radius={733.5}
        blur={300}
      />
      <GradientCircle
        className="absolute size-[75vh] top-[-15vh] right-[20%] opacity-70"
        color="#E477F6"
        radius={733.5}
        blur={300}
      />

      {/* Main container with improved glass effect */}
      <div className="relative mx-auto my-0 sm:my-4 lg:my-6 w-full sm:w-[95%] max-w-[1440px] min-h-[100vh] sm:min-h-[800px] sm:h-[95vh] overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-md bg-[rgba(255,255,255,0.25)] sm:rounded-[30px] border border-white/20">
          <div className="relative w-full h-full flex flex-col lg:flex-row">
            <LoginForm />
            <DesignElements />
          </div>
        </div>
      </div>
    </div>
  );
}

