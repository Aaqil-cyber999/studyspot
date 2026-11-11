"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/auth-store";

const asset = (name: string) => `/assets/${name}.svg`;

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(4, "Enter a password"),
});

function CampusIllustration() {
  return (
    <img
      src="/assets/login/undraw_task-progress_tukr.svg"
      alt=""
      aria-hidden="true"
      className="mx-auto block h-full w-full max-w-[380px] px-[24px] object-contain"
    />
  );
}

export default function UniversityAdminLoginPage() {
  const router = useRouter();
  const setRole = useAuthStore((s) => s.setRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Enter your admin credentials");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = schema.safeParse({ email, password });
    if (!result.success) {
      const msg = result.error.issues[0]?.message ?? "Invalid";
      setMessage(msg);
      toast.error(msg);
      return;
    }
    setMessage("Signing in...");
    setRole("university-admin");
    toast.success("Welcome back, University Admin!");
    router.push("/university-admin/dashboard");
  }

  return (
    <main className="admin-login flex h-dvh w-full max-w-[412px] mx-auto flex-col overflow-hidden bg-white">
      <section className="relative z-10 min-h-0 flex-1 overflow-hidden bg-white" aria-label="University">
        <CampusIllustration />
      </section>

      <section className="relative z-20 mt-[24px] shrink-0 px-[13px] pb-[13px] bg-[#F97316]">
        <div className="absolute z-[-1] -top-[22px] left-[-10px] right-[-10px] h-[60px] rounded-t-[50%] bg-[#F97316]" />
        <div className="relative w-full z-1 pt-[8px]">
          <h1 className="text-center text-[27px] font-normal leading-normal text-white" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
            Sign in as admin
          </h1>

          <form className="mt-[16px] flex w-full flex-col gap-[18px] rounded-[24px] border border-[#fed7aa] bg-white p-[28px_24px] shadow-[0_4px_12px_rgba(66,20,8,0.06)]" onSubmit={submit} noValidate>
            <div className="flex flex-col gap-0">
              <label htmlFor="admin-email" className="mb-[10px] ml-[7px] block text-[13px] font-medium leading-normal text-[#0f172a]" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
                Email address
              </label>
              <div className="flex h-[58px] items-center gap-[12px] rounded-[14px] border border-[#fed7aa] p-[10px_14px]">
                <span className="grid size-[36px] flex-none place-items-center rounded-[10px] bg-[#feedd2]">
                  <img src={asset("f1e0b")} alt="" className="block size-[18px]" />
                </span>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@university.edu"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setMessage("Enter your admin credentials");
                  }}
                  className="min-w-0 flex-1 border-0 bg-transparent text-[15px] font-light leading-normal text-[#334155] outline-none"
                  style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-0">
              <label htmlFor="admin-password" className="mb-[10px] ml-[7px] block text-[13px] font-medium leading-normal text-[#0f172a]" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
                Password
              </label>
              <div className="flex h-[58px] items-center gap-[12px] rounded-[14px] border border-[#fed7aa] p-[10px_14px]">
                <span className="grid size-[36px] flex-none place-items-center rounded-[10px] bg-[#feedd2]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#f97316" strokeWidth="1.5" />
                    <circle cx="12" cy="16" r="1" stroke="#f97316" strokeWidth="1.5" />
                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setMessage("Enter your admin credentials");
                  }}
                  className="min-w-0 flex-1 border-0 bg-transparent text-[15px] font-light leading-normal text-[#334155] outline-none"
                  style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}
                />
              </div>
            </div>

            <button type="submit" className="flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-[10px] rounded-[16px] border border-[#f97316] bg-[#f97316] px-[16px] py-[16px] text-[15px] font-medium leading-normal text-white transition-all duration-140 hover:bg-[#ea580c] hover:shadow-[0_6px_16px_rgba(194,65,12,0.2)] active:scale-[0.985] focus-visible:shadow-[0_0_0_3px_#ffffff,0_0_0_5px_#c2410c]">
              <span>Continue</span>
              <img src={asset("dcf95")} alt="" className="block size-[18px]" />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
