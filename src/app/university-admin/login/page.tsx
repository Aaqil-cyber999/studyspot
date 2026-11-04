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
    <div className="flex min-h-screen flex-col justify-end bg-orange-500 p-6">
      <div className="mb-8 text-center text-white">
        <h1 className="text-3xl font-bold">Admin Login</h1>
        <p className="mt-1 text-sm opacity-90">University Admin</p>
      </div>
      <div className="rounded-3xl bg-white p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-orange-200 px-4 py-3">
            <Mail className="size-5 text-orange-500" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-orange-200 px-4 py-3">
            <Lock className="size-5 text-orange-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button
            onClick={submit}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 font-medium text-white"
          >
            Continue <ArrowRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}