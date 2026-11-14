"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/auth-store";
import { Lock, Mail, ArrowRight } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(4, "Enter a password"),
});

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const setRole = useAuthStore((s) => s.setRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = schema.safeParse({ email, password });
    if (!result.success) {
      const msg = result.error.issues[0]?.message ?? "Invalid";
      toast.error(msg);
      return;
    }
    setLoading(true);
    setRole("super-admin");
    toast.success("Welcome back, Super Admin!");
    setTimeout(() => {
      setLoading(false);
      router.push("/super-admin/dashboard");
    }, 800);
  }

  return (
    <div className="min-h-screen bg-[#fbfbfc] px-4 lg:px-0 pt-[16px] lg:pt-0 pb-[120px] lg:pb-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-0 lg:h-screen">
        {/* Left column — illustration only */}
        <div className="lg:min-h-full lg:flex lg:flex-col lg:justify-center lg:items-center lg:py-8 lg:px-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/login/undraw_software-engineer_ljie.svg" alt="Super Admin dashboard illustration" className="mx-auto w-[400px] h-auto lg:w-[560px] mb-4" />
        </div>

        {/* Right column — sign-in form with all text */}
        <div className="lg:min-h-full lg:flex lg:flex-col lg:justify-center lg:items-center lg:bg-[#f97316] lg:rounded-tl-[48px] lg:rounded-bl-[48px] lg:rounded-tr-0 lg:rounded-br-0 space-y-4 lg:py-8 lg:px-8 text-center">
          <form onSubmit={submit} className="space-y-4 noValidate bg-white rounded-[20px] p-8 lg:p-8 min-w-[520px] max-w-[640px] text-left">
            <div className="flex items-center gap-2 justify-center mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/welcome/logo.png" alt="SpotWise" className="h-20 w-auto" />
              <h2 className="text-[28px] font-semibold tracking-[-0.3px] text-[#0f172a]">SpotWise Admin</h2>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-slate-700">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" aria-hidden="true" />
                <input id="sa-email" name="email" type="email" autoComplete="email" placeholder="superadmin@spotwise.lk" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-[10px] border border-[#e2e8f0] bg-white px-3 py-3 pl-10 text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" aria-hidden="true" />
                <input id="sa-password" name="password" type="password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-[10px] border border-[#e2e8f0] bg-white px-3 py-3 pl-10 text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#f97316] py-3 text-sm font-bold text-white shadow-[0_6px_16px_rgba(249,115,22,0.25)] transition hover:bg-[#ea580c] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2">
              {loading ? "Signing in…" : "Sign in"}
              {!loading && <ArrowRight className="size-4" aria-hidden="true" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
