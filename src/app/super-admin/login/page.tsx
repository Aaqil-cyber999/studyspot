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

function EmailInput({
  value,
  onChange,
  placeholder = "superadmin@spotwise.lk",
}: {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Mail
        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400"
        aria-hidden="true"
      />
      <input
        type="email"
        autoComplete="email"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 pl-10 text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
      />
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <Lock
        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400"
        aria-hidden="true"
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 pl-10 text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
      />
    </div>
  );
}

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
    <div
      className="min-h-screen bg-gradient-to-b from-[#fbfbfc] to-[#f0f4f8] relative overflow-x-hidden"
    >
      <div className="relative flex min-h-screen items-center justify-center p-4 lg:p-0">
        {/* Background abstract shapes */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-[#f97316] opacity-5 blur-2xl -z-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-[#ea580c] opacity-5 blur-2xl -z-10"></div>

        {/* Left decorative column - hidden on lg+ */}
        <div className="lg:hidden lg:w-1/2 absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-white">
            <h1 className="text-2xl font-bold tracking-[-0.3px]">SpotWise Admin</h1>
            <p className="text-sm text-white/80">Manage all universities and locations</p>
          </div>
        </div>

        {/* Login card - visible on lg+, hidden on mobile */}
        <div className="lg:block hidden lg:w-1/2 absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
          <form
            onSubmit={submit}
            className="w-full space-y-4 bg-white rounded-3xl p-8 lg:p-10 min-w-[340px] max-w-[420px] shadow-2xl shadow-black/5"
          >
            <div className="flex items-center justify-center mb-4">
              <img
                src="/assets/welcome/logo.png"
                alt="SpotWise"
                className="h-16 w-auto"
              />
              <h2 className="text-[20px] font-semibold tracking-[-0.3px] text-[#0f172a]">SpotWise Admin</h2>
            </div>

            <EmailInput
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="superadmin@spotwise.lk"
            />

            <PasswordInput
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#f97316] py-3 text-sm font-bold text-white shadow-[0_6px_16px_rgba(249,115,22,0.25)] transition hover:bg-[#ea580c] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
            >
              {loading ? "Signing in…" : "Sign in"}
              <ArrowRight className="size-4 ms-2" aria-hidden={true} />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile-first full-width form - visible on mobile only */}
      <div className="hidden lg:block w-full max-w-full mx-auto">
        <form
          onSubmit={submit}
          className="bg-white rounded-3xl p-8 lg:p-10 min-w-[340px] max-w-[420px] shadow-2xl shadow-black/5"
        >
          <div className="flex items-center justify-center mb-4">
            <img
              src="/assets/welcome/logo.png"
              alt="SpotWise"
              className="h-16 w-auto"
            />
            <h2 className="text-[20px] font-semibold tracking-[-0.3px] text-[#0f172a]">SpotWise Admin</h2>
          </div>

          <EmailInput
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="superadmin@spotwise.lk"
          />

          <PasswordInput
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#f97316] py-3 text-sm font-bold text-white shadow-[0_6px_16px_rgba(249,115,22,0.25)] transition hover:bg-[#ea580c] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
          >
            {loading ? "Signing in…" : "Sign in"}
            <ArrowRight className="size-4 ms-2" aria-hidden={true} />
          </button>
        </form>
      </div>
    </div>
  );
}