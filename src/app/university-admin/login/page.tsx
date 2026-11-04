"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export default function UaLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const result = schema.safeParse({ email, password });
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid";
      setError(message);
      toast.error(message);
      return;
    }
    setError(null);
    toast.success("Signed in");
    router.push("/university-admin/dashboard");
  }

  return (
    <div className="mx-auto min-h-screen w-[412px] bg-[#fbfbfc]">
      <div className="relative flex min-h-screen flex-col items-center">
        <div className="absolute top-0 left-1/2 w-[min(100%,412px)] -translate-x-1/2">
          <div className="relative h-[397px] w-full">
            <div className="absolute left-[-178px] top-[200px] h-[589px] w-[924px] opacity-60">
              <img alt="" className="absolute inset-0 max-w-none size-full" src="/assets/welcome/ellipse1.svg" />
            </div>
            <div className="absolute left-[-345px] top-[180px] h-[589px] w-[924px] opacity-60">
              <img alt="" className="absolute inset-0 max-w-none size-full" src="/assets/welcome/ellipse3.svg" />
            </div>
          </div>
        </div>
        <div className="relative z-10 mt-[280px] w-full px-[24px]">
          <h1 className="text-center text-[32px] font-semibold tracking-[-0.3px] text-[#0f172a]">Sign in as admin</h1>
          <p className="mt-1 text-center text-[14px] text-[#64748b]">University Admin</p>
          <div className="mt-[40px] w-full rounded-[24px] border border-[#e2e8f0] bg-white p-[24px] shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
            <div className="space-y-[16px]">
              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#334155]">Email</label>
                <div className="flex items-center gap-3 rounded-[16px] border border-[#e2e8f0] px-[16px] py-[12px]">
                  <Mail className="size-5 text-[#f97316]" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-transparent text-[14px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#334155]">Password</label>
                <div className="flex items-center gap-3 rounded-[16px] border border-[#e2e8f0] px-[16px] py-[12px]">
                  <Lock className="size-5 text-[#f97316]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="flex-1 bg-transparent text-[14px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
                  />
                </div>
              </div>
              {error ? <p className="text-[13px] text-red-500">{error}</p> : null}
              <button
                onClick={submit}
                className="mt-[8px] flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#f97316] py-[14px] text-[14px] font-medium text-white shadow-[0px_6px_16px_rgba(249,115,22,0.25)] transition hover:opacity-95"
              >
                Continue <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}