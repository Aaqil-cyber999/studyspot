"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import toast from "react-hot-toast";

const asset = (name: string) => `/assets/${name}.svg`;
const otpAsset = (name: string) => `/assets/otp/${name}`;

export default function OtpVerificationPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [countdown, setCountdown] = useState(0);
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

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(119);
    toast.success("New verification code sent");
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submit = () => {
    toast.success("Email verified");
    router.push("/student/info");
  };

  return (
    <main className="relative min-h-screen w-[412px] mx-auto bg-white overflow-hidden">
      {/* Illustration */}
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
      {/* Background ellipse (decorative) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="relative top-[450px] left-[-10px] w-[105%] h-25 rounded-t-[50%] rounded-b-none bg-[#F97316]" />
        <div className="absolute flex h-[830.574px] items-center justify-center top-[485px] w-[1088.171px] bg-[#F97316]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center pt-[200px]">
        <div className="h-[15px] w-[29px] rounded-[7.5px] bg-white blur-[2.5px] opacity-60 mb-[291px]" />

        {/* Verify your email heading */}
        <p className="text-center text-[27px] mt-[-10px] font-normal leading-normal text-white" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
          Verify your email
        </p>

        {/* Form card */}
        <div className="mt-[30px] flex w-[387px] flex-col gap-0 rounded-[16px] bg-white p-[28px_24px] shadow-[0px_4px_12px_rgba(66,20,8,0.06)]">
          {/* Enter the OTP */}
          <p className="mb-[10px] text-center text-[18px] font-normal leading-normal text-black" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
            Enter the OTP
          </p>
          {/* Helper text */}
          <p className="mb-[13px] text-center text-[14px] font-normal leading-[1.45] text-[#64748b]" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
            Enter the six-digit code sent to s•••.@example.com
          </p>
          {/* One-time code digits */}
          <div className="flex gap-[7.4px] justify-center">
            {otp.map((digit, i) => (
              <div key={i} className={`flex h-[58px] w-[52px] shrink-0 items-center justify-center rounded-[12px] border border-solid bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.04)] ${i === activeIndex ? "border-2 border-[#f97316] shadow-[0px_2px_10px_0px_rgba(249,115,22,0.18)]" : "border-[#dae2ea]"}`}>
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
                  onFocus={() => setActiveIndex(i)}
                  onBlur={() => setActiveIndex(-1)}
                  pattern="[0-9]*"
                  className="w-full h-full text-center text-[24px] font-semibold leading-normal text-[#0f172a] bg-transparent border-0 outline-none"
                  style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}
                />
              </div>
            ))}
          </div>
          {/* Continue button */}
          <button onClick={submit} className="mt-[23px] flex w-full items-center justify-center gap-[10px] overflow-clip rounded-[16px] bg-[#f97316] p-[16px] cursor-pointer">
            <p className="text-[15px] font-medium leading-normal text-white whitespace-nowrap" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
              Verify &amp; Continue
            </p>
            <img alt="" className="size-[18px] max-w-none" src="/assets/dcf95.svg" />
          </button>{" "}
          {/* Resend code */}
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
      </div>
    </main>
  );
}
