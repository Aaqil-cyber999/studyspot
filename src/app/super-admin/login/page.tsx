"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { api } from "@/services/api";
import { useAuthStore } from "@/stores/auth-store";

const schema = {
  email: (value: string) => value.includes("@") && value.length > 5,
  password: (value: string) => value.length >= 4,
};

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!schema.email(email) || !schema.password(password)) {
      setError("Enter a valid email and password.");
      return;
    }
    setLoading(true);
    try {
      const data = await api.post("/api/auth/login", { email, password });
      setAuth({
        role: "super-admin",
        userName: data.user.name,
        email: data.user.email,
        university: data.user.university,
        image: data.user.image ?? null,
      });
      router.push("/super-admin/dashboard");
    } catch (loginError) {
      console.error("Login error:", loginError);
      setError("We couldn’t sign you in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen overflow-x-hidden bg-[#f7f7f5] lg:h-screen lg:grid-cols-2 lg:overflow-hidden">
      <div className="relative z-10 hidden min-h-0 overflow-hidden bg-[#f7f7f5] px-10 py-9 text-slate-900 lg:flex lg:flex-col lg:items-center lg:justify-between">
        <div className="pointer-events-none absolute -right-36 -top-32 size-[520px] rounded-full border border-orange-200/[0.55]" />
        <div className="pointer-events-none absolute -bottom-48 -left-36 size-[500px] rounded-full border border-orange-200/[0.4]" />
        <div className="pointer-events-none absolute right-20 top-28 size-3 rounded-full bg-primary shadow-[0_0_24px_8px_rgba(249,115,22,0.18)]" />
        <div className="pointer-events-none absolute bottom-36 left-24 size-2 rounded-full bg-orange-300 shadow-[0_0_20px_6px_rgba(249,115,22,0.2)]" />
        <div className="pointer-events-none absolute -right-24 top-[-8%] z-20 h-[116%] w-48 rounded-[50%] bg-[#f7f7f5] shadow-[20px_0_45px_-35px_rgba(194,65,12,0.45)]" />
        <div className="relative z-10 flex w-full max-w-xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-orange-200"><ShieldCheck className="size-5" /></span>
            <span><span className="block text-[15px] font-semibold tracking-tight">SpotWise</span><span className="block text-xs text-slate-500">Admin console</span></span>
          </div>
          <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-orange-700">Workspace</span>
        </div>
        <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
          <div className="relative mb-10 h-64 w-full max-w-md">
            <div className="absolute left-1/2 top-1/2 h-52 w-64 -translate-x-1/2 -translate-y-1/2 rounded-[45%] border border-orange-100/30 bg-[#9a3412] shadow-2xl shadow-orange-950/25" />
            <div className="absolute bottom-1 left-1/2 h-20 w-72 -translate-x-1/2 rounded-[50%] bg-[#7c2d12] shadow-[0_0_34px_8px_rgba(124,45,18,0.2)]" />
            <div className="absolute bottom-12 left-1/2 h-24 w-44 -translate-x-1/2 rounded-t-2xl bg-[#fed7aa] shadow-xl shadow-orange-950/25">
              <div className="absolute inset-x-5 top-5 h-2 rounded-full bg-[#ea580c]/45" />
              <div className="absolute inset-x-5 top-11 h-2 rounded-full bg-[#ea580c]/35" />
            </div>
            <div className="absolute bottom-10 left-[calc(50%-112px)] h-20 w-2 rounded-full bg-[#d68c57]" />
            <div className="absolute bottom-10 left-[calc(50%+110px)] h-20 w-2 rounded-full bg-[#d68c57]" />
            <div className="absolute bottom-28 left-[calc(50%-40px)] h-12 w-20 rounded-t-full border-4 border-b-0 border-[#f4c18c]" />
            <div className="absolute bottom-[134px] left-1/2 size-4 -translate-x-1/2 rounded-full bg-[#f4c18c]" />
            <div className="absolute bottom-8 left-[calc(50%-164px)]">
              <div className="mx-auto h-12 w-2 rounded-full bg-[#7eb18b]" />
              <div className="absolute bottom-8 -left-5 h-10 w-12 -rotate-12 rounded-[80%_10%_80%_10%] bg-[#8fc49b]" />
              <div className="absolute bottom-12 left-0 h-9 w-12 rotate-45 rounded-[10%_80%_10%_80%] bg-[#6da97b]" />
            </div>
            <div className="absolute bottom-8 right-[calc(50%-164px)] h-9 w-12 rounded-b-xl bg-[#e6a36a]">
              <div className="absolute -top-10 left-1/2 h-11 w-2 -translate-x-1/2 rounded-full bg-[#7eb18b]" />
              <div className="absolute -top-11 -left-2 h-8 w-10 -rotate-12 rounded-[80%_10%_80%_10%] bg-[#8fc49b]" />
              <div className="absolute -top-8 left-4 h-7 w-9 rotate-45 rounded-[10%_80%_10%_80%] bg-[#6da97b]" />
            </div>
          </div>
          <div className="mb-1 flex items-center gap-2 text-sm font-medium tracking-wide text-orange-600">
            <span className="size-1.5 rounded-full bg-primary" />
            A calmer way to manage campus spaces
            <span className="size-1.5 rounded-full bg-orange-300" />
          </div>
          <h1 className="mt-4 max-w-md text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-slate-900">Make every study space count.</h1>
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">Keep institutions, people, and places connected so students can find their next productive corner.</p>
        </div>
        <p className="relative z-10 text-xs text-slate-400">SpotWise platform · Secure access</p>
      </div>
      <div className="relative z-0 flex min-h-screen items-center justify-center overflow-hidden rounded-t-[3.5rem] bg-[#f7f7f5] px-5 py-12 sm:px-8 lg:min-h-0 lg:rounded-l-[32%] lg:rounded-t-none lg:bg-[linear-gradient(135deg,#F97316_0%,#ea580c_52%,#9a3412_100%)]">
        <div className="pointer-events-none absolute -left-28 top-[-12%] hidden h-[124%] w-56 rounded-[50%] border border-orange-100/20 lg:block" />
        <div className="pointer-events-none absolute -right-32 -top-24 size-72 rounded-full bg-orange-300/15 blur-3xl" />
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-orange-200"><ShieldCheck className="size-5" /></span>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
          </div>
          <div className="rounded-[28px] bg-white p-7 text-left shadow-[0_24px_70px_-35px_rgba(16,35,31,0.35)] ring-1 ring-slate-200/80 sm:rounded-[32px] sm:p-10">
            <div className="mb-9">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-8 rounded-full bg-primary" />
                <span className="h-1.5 w-3 rounded-full bg-orange-300" />
                <span className="h-1.5 w-2 rounded-full bg-orange-200" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Super admin access</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-900">Welcome back.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">Sign in to keep the SpotWise network running smoothly.</p>
            </div>
            <form onSubmit={submit} className="mt-8 space-y-5">
              <label className="block text-sm font-medium text-slate-700">
                Email address
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="superadmin@spotwise.lk" className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-orange-100" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Password
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" placeholder="Enter your password" className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-orange-100" />
              </label>
              {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-white shadow-lg shadow-orange-200/70 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Signing in..." : "Continue"}
                {!loading && <ArrowRight className="size-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
