"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
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
    <div className="relative mx-auto min-h-screen w-full max-w-[412px] overflow-hidden bg-white">
      {/* Orange curved background (rotated ellipse from Figma) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-358px] top-[416px] flex h-[830.574px] w-[1088.171px] items-center justify-center"
      >
        <div className="flex-none -rotate-[90.33deg]">
          <div className="relative h-[1083.49px] w-[824.413px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="absolute inset-0 max-w-none" src="/assets/ua-login/26842.svg" />
          </div>
        </div>
      </div>

      {/* Heading */}
      <p
        className="absolute left-1/2 top-[487px] w-[233px] -translate-x-1/2 text-center font-body text-[27px] font-normal leading-normal text-white"
        style={{ wordBreak: "break-word" }}
      >
        Sign in as admin
      </p>

      {/* Form card */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="absolute left-[13px] top-[547px] flex h-[354px] w-[387px] flex-col gap-[23px] rounded-[24px] border border-[#fed7aa] bg-white px-[24px] py-[28px] drop-shadow-[0px_4px_12px_rgba(66,20,8,0.06)]"
      >
        {/* Email field */}
        <div className="flex flex-col gap-[12px]">
          <label htmlFor="university-admin-email" className="whitespace-nowrap font-body text-[13px] font-medium text-[#0f172a]">
            Email address
          </label>
          <div className="flex w-full items-center gap-[12px] rounded-[14px] border border-[#fed7aa] bg-white px-[14px] py-[10px]">
            <span className="flex size-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#feedd2]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="size-[18px] max-w-none" src="/assets/ua-login/f1e0b.svg" />
            </span>
            <input
              id="university-admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              aria-invalid={Boolean(error)}
              placeholder="admin@example.com"
              className="min-w-0 flex-1 bg-transparent font-body text-[15px] font-light text-[#334155] outline-none placeholder:text-[#334155]"
            />
          </div>
        </div>

        {/* Password field */}
        <div className="flex flex-col gap-[12px]">
          <label htmlFor="university-admin-password" className="whitespace-nowrap font-body text-[13px] font-medium text-[#0f172a]">
            Password
          </label>
          <div className="relative h-[58px] w-full rounded-[14px] border border-[#fed7aa] bg-white">
            <span className="absolute left-[14px] top-[10px] flex size-[36px] items-center justify-center rounded-[10px] bg-[#feedd2]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="size-[24px] max-w-none" src="/assets/ua-login/585e6.svg" />
            </span>
            <input
              id="university-admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              aria-invalid={Boolean(error)}
              placeholder="*****************"
              className="absolute left-[62px] top-1/2 w-[223px] -translate-y-1/2 bg-transparent font-body text-[15px] font-light text-[#334155] outline-none placeholder:text-[#334155]"
            />
          </div>
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-[#e2e8f0]" />

        {error ? <p className="text-sm text-red-500" role="alert">{error}</p> : null}

        {/* Continue button */}
        <button
          type="submit"
          className="relative h-[51px] w-full overflow-hidden rounded-[16px] bg-[#f97316] transition-colors hover:bg-[#ea6a0f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
        >
          <span className="absolute left-[121px] top-[16px] font-body text-[15px] font-medium text-white">
            Continue
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className="absolute left-[198px] top-[16.5px] size-[18px] max-w-none"
            src="/assets/ua-login/e3f51.svg"
          />
        </button>
      </form>
    </div>
  );
}
