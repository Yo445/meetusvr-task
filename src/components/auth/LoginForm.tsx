'use client';

import { useRouter } from "next/navigation";
import { InputField } from "@/components/InputField";
import { Lock, Mail } from "@/assets/icons/icons";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser } from "@/redux/features/authSlice";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the login form schema with Zod
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Type for our form data based on the schema
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.auth);
  
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setError: setFormError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const resultAction = await dispatch(loginUser(data));
      
      if (loginUser.fulfilled.match(resultAction)) {
        router.push("/dashboard");
        router.refresh();
      } else if (loginUser.rejected.match(resultAction)) {
        throw new Error(resultAction.payload as string);
      }
    } catch (err) {
      setFormError("root", { 
        type: "manual",
        message: err instanceof Error ? err.message : "An unexpected error occurred"
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#e6eafc] via-[#ede3fa] to-[#f5d6ff]">
      {/* Left: Form Section */}
      <div className="flex flex-1 items-center justify-center pl-8 pr-4 sm:pl-12 sm:pr-6 lg:pl-20 lg:pr-10">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-8">
          {/* Heading */}
          <div className="text-center">
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
            <div>
              <InputField
                icon={<Mail className="w-[22px] h-[22px] text-[#62626b]" />}
                placeholder="Email"
                type="email"
                error={errors.email?.message}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <InputField
                icon={<Lock className="w-[22px] h-[22px] text-[#62626b]" />}
                placeholder="Password"
                type="password"
                error={errors.password?.message}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            {errors.root && (
              <p className="text-sm text-red-600 text-center mt-2">
                {errors.root.message}
              </p>
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
            Don&apos;t have an account?
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
