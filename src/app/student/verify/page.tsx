"use client";

import { FormEvent, useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Info } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/auth-store";
import { api, ApiError } from "@/services/api";
import { showDemoOtpToast } from "@/components/shared/demo-otp-toast";
import { me } from "@/services/auth";
import { useProfileStore } from "@/stores/profile-store";

const asset = (name: string) => `/assets/${name}.svg`;
const otpAsset = (name: string) => `/assets/otp/${name}`;

function OtpVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const setSession = useAuthStore((s) => s.setSession);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [countdown, setCountdown] = useState(0);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isShaking, setIsShaking] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleResend = async () => {
    if (countdown > 0 || !email) return;
    try {
      const res = await api.post<{ ok: boolean; devCode?: string }>("/auth/otp/request", { email });
      setCountdown(119);
      if (res.devCode) {
        showDemoOtpToast(email, res.devCode);
      } else {
        toast.success("New verification code sent");
      }
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Unable to resend the code");
    }
  };

  const triggerWrongOtp = (message = "Incorrect code. Please try again.") => {
    setStatus("error");
    setIsShaking(true);
    toast.error(message);
    setTimeout(() => {
      setIsShaking(false);
    }, 450);
  };

  const triggerCorrectOtp = (destination: string, isNewAccount?: boolean) => {
    setStatus("success");
    toast.success(isNewAccount ? "Email verified" : "Welcome back!");
    setTimeout(() => {
      router.push(destination);
    }, 600);
  };

  const checkOtp = async (enteredOtp: string) => {
    if (!email) {
      triggerWrongOtp("Missing email — go back and enter your email again.");
      return;
    }
    setVerifying(true);
    try {
      const res = await api.post<{ user: { name: string }; isNewAccount?: boolean }>("/auth/otp/verify", { email, code: enteredOtp });
      setSession("student", res.user.name);
      // Hydrate the profile cache too — the app-mount hydrator ran before the
      // session existed, so refresh it now that /auth/me will succeed.
      try {
        const user = await me();
        if (user) {
          useProfileStore.getState().hydrateFromApi({
            name: user.name,
            address: user.address,
            faculty: user.faculty,
            studyStyle: user.studyStyle,
            noiseLevel: user.noiseLevel,
            studyType: user.studyType,
            amenities: user.amenities,
            profileImg: user.profileImg,
          });
        }
      } catch {
        // Greeting falls back to defaults; the profile page re-fetches.
      }
      // Returning students go straight to Discover; brand-new accounts go
      // through onboarding (name / university / details).
      triggerCorrectOtp(res.isNewAccount ? "/student/info" : "/student/home", res.isNewAccount);
    } catch (error) {
      triggerWrongOtp(error instanceof ApiError ? error.message : "Incorrect code. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (status !== "idle") {
      setStatus("idle");
    }

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newOtp.join("");
    if (fullCode.length === 6) {
      checkOtp(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter") {
      submit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);
    if (status !== "idle") setStatus("idle");
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
    if (pasted.length === 6) {
      checkOtp(pasted);
    }
  };

  const submit = () => {
    const fullCode = otp.join("");
    if (fullCode.length < 6) {
      triggerWrongOtp();
      return;
    }
    checkOtp(fullCode);
  };

  return (
    <main className="flex min-h-dvh w-full md:max-w-[412px] mx-auto flex-col overflow-hidden bg-[#E2E8F0]">
      {/* Illustration */}
      <section className="relative z-0 w-full shrink-0 aspect-[412/300] bg-[#E2E8F0] min-h-[220px]" aria-label="Verify your email illustration">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-[13.41%_0.24%_58.91%_0%]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={otpAsset("06fa6.svg")} />
          </div>
          <div className="absolute inset-[13.41%_0.24%_70.84%_0%]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={otpAsset("22335.svg")} />
          </div>
          <div className="absolute inset-[33.21%_3.43%_59.49%_2.53%]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={otpAsset("540f1.svg")} />
          </div>
          <div className="absolute inset-[14.08%_14.23%_66.77%_17.55%]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={otpAsset("ca980.svg")} />
          </div>
          <div className="absolute inset-[23.16%_41.41%_58.91%_4.17%]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={otpAsset("c420c.svg")} />
          </div>
          <div className="absolute inset-[28.17%_1.88%_59.42%_72.39%]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={otpAsset("ce689.svg")} />
          </div>
          <div className="absolute inset-[25.02%_59.04%_70.81%_25.83%]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={otpAsset("64f59.svg")} />
          </div>
        </div>
      </section>

      {/* Orange panel */}
      <section className="relative z-20 flex-1 bg-[#F97316] rounded-t-[28px] px-[13px] pb-6 pt-4">
        <p className="text-center text-[27px] font-normal leading-normal text-white" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
          Verify your email
        </p>

        {/* Form card */}
        <div className="mt-4 flex w-full flex-col gap-0 rounded-[16px] bg-white p-[28px_24px] shadow-[0px_4px_12px_rgba(66,20,8,0.06)]">
          <p className="mb-[10px] text-center text-[18px] font-normal leading-normal text-black" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
            Enter the OTP
          </p>
          <p className="mb-[13px] text-center text-[14px] font-normal leading-[1.45] text-[#64748b]" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
            Enter the six-digit code sent to {email || "your email"}
          </p>
          <div className={`flex gap-[7.4px] justify-center transition-transform ${isShaking ? "animate-shake" : ""}`}>
            {otp.map((digit, i) => {
              let ringClass = "border-[#b8c4d1]";
              let textClass = "text-[#0f172a]";

              if (status === "success") {
                ringClass = "border-2 border-emerald-500 bg-emerald-50/25 shadow-[0px_2px_12px_0px_rgba(16,185,129,0.3)]";
                textClass = "text-emerald-700 font-bold";
              } else if (status === "error") {
                ringClass = "border-2 border-red-500 bg-red-50/25 shadow-[0px_2px_12px_0px_rgba(239,68,68,0.3)]";
                textClass = "text-red-600 font-bold";
              } else if (i === activeIndex) {
                ringClass = "border-2 border-[#f97316] shadow-[0px_2px_10px_0px_rgba(249,115,22,0.18)]";
              }

              return (
                <div
                  key={i}
                  className={`flex h-[58px] w-[48px] shrink-0 items-center justify-center rounded-[12px] border border-solid bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.04)] transition-all duration-200 ${ringClass}`}
                >
                  <input
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value.replace(/[^0-9]/g, ""))}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    onFocus={() => setActiveIndex(i)}
                    onBlur={() => setActiveIndex(-1)}
                    pattern="[0-9]*"
                    className={`w-full h-full text-center text-[24px] font-semibold leading-normal bg-transparent border-0 outline-none transition-colors duration-200 ${textClass}`}
                    style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={submit} disabled={verifying} className="mt-[23px] flex w-full items-center justify-center gap-[10px] overflow-clip rounded-[16px] bg-[#f97316] p-[16px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-70">
            <p className="text-[15px] font-medium leading-normal text-white whitespace-nowrap" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
              {verifying ? "Verifying…" : "Verify & Continue"}
            </p>
            <img alt="" className="size-[18px] max-w-none" src="/assets/dcf95.svg" />
          </button>
          <button onClick={handleResend} disabled={countdown > 0} className="mt-[25px] w-full text-center text-[13px] font-normal leading-[1.45] cursor-pointer disabled:cursor-not-allowed" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
            {countdown > 0 ? <span className="text-[#64748b]">Resend code in {formatTime(countdown)}</span> : <span className="text-[#f97316] font-medium">Resend code</span>}
          </button>
        </div>

        {/* Spam hint */}
        <div className="mt-[20px] flex h-[18px] w-full items-center justify-center gap-[6px] whitespace-nowrap text-white">
          <Info className="size-[16px] font-medium" />
          <span className="text-[13px] font-medium">Didn&apos;t receive?</span>
          <span className="text-[13px] font-normal">Check the spam/junk folder</span>
        </div>
      </section>
    </main>
  );
}

export default function OtpVerificationPage() {
  return (
    <Suspense fallback={null}>
      <OtpVerification />
    </Suspense>
  );
}
