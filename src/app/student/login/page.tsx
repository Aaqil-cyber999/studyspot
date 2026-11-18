"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api, ApiError } from "@/services/api";
import { showDemoOtpToast } from "@/components/shared/demo-otp-toast";

const asset = (name: string) => `/assets/${name}.svg`;

function CampusIllustration() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <img className="art absolute block max-w-none top-[18%] left-[23.45%] w-[53.09%]" src={asset("12bb6")} alt="" />
      <img className="art absolute block max-w-none top-[30.1%] left-[69.97%] w-[18.37%]" src={asset("5debe")} alt="" />
      <img className="art absolute block max-w-none top-[30.1%] left-[11.65%] w-[18.37%]" src={asset("d46b1")} alt="" />
      <img className="art absolute block max-w-none top-[51.25%] left-[12.03%] w-[75.93%]" src={asset("465a7")} alt="" />
      <img className="art absolute block max-w-none top-[73.3%] left-[15.61%] w-[67.94%]" src={asset("3ec06")} alt="" />
      <img className="art absolute block max-w-none top-[27.7%] left-[77.3%] w-[7.46%]" src={asset("bcf2f")} alt="" />
      <img className="art absolute block max-w-none top-[27.7%] left-[15.33%] w-[7.46%]" src={asset("f661e")} alt="" />
      <img className="art absolute block max-w-none top-[36.9%] left-[57.48%] w-[24.37%]" src={asset("96020")} alt="" />
      <img className="art absolute block max-w-none top-[41.4%] left-[51.75%] w-[6.12%]" src={asset("b99a2")} alt="" />
      <img className="art absolute block max-w-none top-[40.1%] left-[40.64%] w-[9.23%]" src={asset("d6f3b")} alt="" />
      <img className="art absolute block max-w-none top-[49%] left-[41.58%] w-[15.79%]" src={asset("a5bf3")} alt="" />
      <img className="art absolute block max-w-none top-[33.2%] left-[42.5%] w-[11.62%]" src={asset("c3cf2")} alt="" />
      <img className="art absolute block max-w-none top-[54.9%] left-[18.66%] w-[14.97%]" src={asset("79c52")} alt="" />
      <img className="art absolute block max-w-none top-[37.4%] left-[18.12%] w-[22.28%]" src={asset("6d40a")} alt="" />
    </div>
  );
}

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("We'll send an OTP to verify your email");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const submitEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValid) {
      setSubmitted(false);
      setMessage("Enter a valid email address");
      toast.error("Enter a valid email address");
      return;
    }

    setSending(true);
    try {
      const res = await api.post<{ ok: boolean; devCode?: string }>("/auth/otp/request", { email });
      setSubmitted(true);
      setMessage(`OTP sent to ${email}`);
      if (res.devCode) {
        showDemoOtpToast(email, res.devCode);
      } else {
        toast.success(`OTP sent to ${email}`);
      }
      router.push(`/student/verify?email=${encodeURIComponent(email)}`);
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : "Unable to send the code. Please try again.";
      setSubmitted(false);
      setMessage(msg);
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  const useGoogle = () => {
    setSubmitted(true);
    setMessage("Google sign-in selected");
    toast.success("Google sign-in selected");
  };

  return (
    <main className="flex min-h-dvh w-full md:max-w-[412px] mx-auto flex-col overflow-x-hidden overflow-y-auto bg-[#E2E8F0]">
      {/* Row 1 — illustration */}
      <section className="relative flex min-h-[200px] w-full flex-1 shrink items-center justify-center bg-[#E2E8F0]" aria-label="University students">
        <div className="relative mx-auto -mt-[48px] aspect-[412/397] w-full max-w-[412px] max-h-full">
          <CampusIllustration />
        </div>
      </section>

      {/* Row 2 — title + form */}
      <section className="relative z-10 flex w-full shrink-0 flex-col justify-center rounded-t-[28px] bg-[#F97316] p-[13px]">
        <div className="w-full z-1">
          <h1 className="mt-[8px] mb-[18px] text-center text-[27px] font-normal leading-normal text-white" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
            Sign in as student
          </h1>

          <form className="mt-[12px] flex w-full flex-col gap-[23px] rounded-[24px] border border-[#fed7aa] bg-white p-[28px_24px] shadow-[0_4px_12px_rgba(66,20,8,0.06)]" onSubmit={submitEmail} noValidate>
            <div className="flex flex-col gap-0">
              <label htmlFor="student-email" className="mb-[10px] ml-[7px] block text-[13px] font-medium leading-normal text-[#0f172a]" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
                Enter your email address
              </label>
              <div className={`flex h-[58px] items-center gap-[12px] rounded-[14px] border p-[10px_14px] transition-colors transition-shadow duration-160 ${submitted ? "border-[#fb923c]" : "border-[#fed7aa]"}`}>
                <span className="grid size-[36px] flex-none place-items-center rounded-[10px] bg-[#feedd2]">
                  <img src={asset("f1e0b")} alt="" className="block size-[18px]" />
                </span>
                <input
                  id="student-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setSubmitted(false);
                    setMessage("We'll send an OTP to verify your email");
                  }}
                  aria-describedby="email-help"
                  className="min-w-0 flex-1 border-0 bg-transparent text-[15px] font-light leading-normal text-[#334155] outline-none"
                  style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}
                />
              </div>
              <p id="email-help" className={`mt-[13px] min-h-[15px] text-center text-[12px] font-light leading-normal ${message.startsWith("Enter") ? "text-[#c2410c]" : "text-[#64748b]"}`} style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
                {message}
              </p>
            </div>

            <button type="submit" disabled={sending} className="flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-[10px] rounded-[16px] border border-[#f97316] bg-[#f97316] px-[16px] py-[16px] text-[15px] font-medium leading-normal text-white transition-all duration-140 hover:bg-[#ea580c] hover:shadow-[0_6px_16px_rgba(194,65,12,0.2)] active:scale-[0.985] focus-visible:shadow-[0_0_0_3px_#ffffff,0_0_0_5px_#c2410c] disabled:cursor-not-allowed disabled:opacity-70">
              <span>{sending ? "Sending…" : "Continue"}</span>
              <img src={asset("dcf95")} alt="" className="block size-[18px]" />
            </button>

            <div className="flex items-center gap-[12px]" aria-hidden="true">
              <span className="h-px flex-1 bg-[#e2e8f0]" />
              <b className="text-[10px] font-medium leading-normal tracking-[1.5px] text-[#94a3b8]" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
                OR
              </b>
              <span className="h-px flex-1 bg-[#e2e8f0]" />
            </div>

            <button type="button" onClick={useGoogle} className="flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-[10px] rounded-[16px] border border-[#fed7aa] bg-white px-[16px] py-[16px] text-[15px] font-medium leading-normal text-[#0f172a] transition-all duration-140 hover:bg-[#d8d8d8] active:scale-[0.985] focus-visible:shadow-[0_0_0_3px_#ffffff,0_0_0_5px_#c2410c]">
              <img src={asset("7e335")} alt="" className="block size-[18px]" />
              <span>Continue with Google</span>
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
