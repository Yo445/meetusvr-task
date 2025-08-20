"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/custom/InputField";
import { Lock, Mail } from "@/assets/icons/icons";
import { useAuthStore } from "@/store/auth";
import Image from "next/image";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function Login() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(
    () => EMAIL_RE.test(email) && password.length > 0,
    [email, password]
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isValid) return;
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Login failed");
      }

      const userInfo = await fetch("/api/user");
      if (userInfo.ok) {
        const data = await userInfo.json();
        setUser({ id: data.id, name: data.name });
        // Add a small delay for better UX transition
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh(); // Ensure dashboard gets fresh data
        }, 300);
      } else {
        throw new Error("Failed to fetch user info");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#e6eafc] via-[#ede3fa] to-[#f5d6ff]">
      {/* Left: Form Section */}
      <div className="flex flex-1 items-center justify-center pl-8 pr-4 sm:pl-12 sm:pr-6 lg:pl-20 lg:pr-10">
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-8">
          {/* Heading */}
          <div>
            <h1 className="text-[#1a1a1e] text-4xl sm:text-5xl lg:text-[56px] font-medium mb-3 leading-[1.15]">
              Welcome back
            </h1>
            <p className="text-[#62626b] text-base sm:text-lg leading-relaxed max-w-sm">
              Step into our shopping metaverse for an unforgettable shopping
              experience
            </p>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <InputField
              icon={<Mail className="w-[22px] h-[22px] text-[#62626b]" />}
              placeholder="Email"
              type="email"
              value={email}
              onChange={(value) => {
                setEmail(value);
                setError(null);
              }}
            />
            <InputField
              icon={<Lock className="w-[22px] h-[22px] text-[#62626b]" />}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(value) => {
                setPassword(value);
                setError(null);
              }}
            />
            {error && (
              <p className="text-sm text-red-600 text-center mt-2">{error}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className="h-[48px] w-full flex items-center justify-center rounded-lg bg-gradient-to-r from-[#9414ff] to-[#d414ff] hover:opacity-90 text-white text-[16px] font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in…" : "Login"}
          </button>

          {/* Sign up link */}
          <p className="text-center text-sm text-[#62626b]">
            Don’t have an account?{" "}
            <span className="text-[#9414ff] hover:text-[#8312e6] underline font-medium cursor-pointer">
              Sign up
            </span>
          </p>
        </form>
      </div>

      {/* Right: Image Section */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center pl-4 pr-8 lg:pl-10 lg:pr-20">
        <div className="w-full max-w-[850px]">
          <Image
            src="/meetusvr-ring.svg"
            alt="MeetusVR ring"
            width={850}
            height={850}
            priority
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="relative w-[413px] h-[70px] mt-8">
          <Image
            src="/meetusvr-word-logo.svg"
            alt="MeetusVR"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
}
