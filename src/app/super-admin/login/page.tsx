"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/auth-store";
import { login, logout } from "@/services/auth";
import { Lock, Mail, ArrowRight } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(4, "Enter a password"),
});

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = schema.safeParse({ email, password });
    if (!result.success) {
      const msg = result.error.issues[0]?.message ?? "Invalid";
      toast.error(msg);
      return;
    }
    setLoading(true);
    try {
      const user = await login(result.data.email, result.data.password);
      if (user.role !== "super-admin") {
        await logout();
        toast.error("This account is not a super admin.");
        return;
      }
      setSession("super-admin", user.name);
      toast.success("Welcome back, Super Admin!");
      router.push("/super-admin/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f97316] lg:bg-[#E2E8F0]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left column — illustration only (desktop) */}
        <div className="hidden items-center justify-center lg:flex lg:p-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/login/undraw_software-engineer_ljie.svg"
            alt="Super Admin dashboard illustration"
            className="h-auto w-full max-w-[520px]"
          />
        </div>

        {/* Right column — sign-in form with all text */}
        <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:min-h-0 lg:rounded-l-[48px] lg:bg-[#f97316] lg:p-12">
          <form
            onSubmit={submit}
            noValidate
            className="w-full max-w-[520px] min-w-0 rounded-[20px] bg-white p-6 shadow-[0_4px_16px_rgba(66,20,8,0.08)] sm:p-8"
          >
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/welcome/logo.png" alt="SpotWise" className="h-14 w-auto sm:h-16" />
              <h1 className="text-[22px] font-semibold tracking-[-0.3px] text-[#0f172a] sm:text-[28px]">
                SpotWise Admin
              </h1>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="sa-email" className="text-[12px] font-medium text-slate-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input
                    id="sa-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="superadmin@spotwise.lk"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-[10px] border border-[#e2e8f0] bg-white py-3 pl-10 pr-3 text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="sa-password" className="text-[12px] font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input
                    id="sa-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-[10px] border border-[#e2e8f0] bg-white py-3 pl-10 pr-3 text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#f97316] py-3 text-sm font-bold text-white shadow-[0_6px_16px_rgba(249,115,22,0.25)] transition hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Sign in"}
                {!loading && <ArrowRight className="size-4" aria-hidden="true" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
