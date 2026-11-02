"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, GraduationCap, MapPin, ChevronRight, ArrowRight } from "lucide-react";
import { chooseUniversitySchema } from "@/features/student/schemas";

const asset = (name: string) => `/assets/${name}.svg`;

function CampusIllustration() {
  return (
    <div className="art-canvas absolute top-[14%] left-1/2 w-[min(90%,370px)] aspect-[412/397] -translate-x-1/2" aria-hidden="true">
      <img className="absolute block max-w-none inset-0 size-full" src="/assets/info/illustration.svg" alt="" />
    </div>
  );
}

export default function InfoPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  function submit() {
    const result = chooseUniversitySchema.safeParse({ name, university, address });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setError(null);
    router.push("/student/select-university");
  }

  return (
    <main className="min-h-screen w-[412px] mx-auto overflow-x-hidden overflow-y-auto bg-white">
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`}</style>
      <section className="relative z-10 min-h-[390px] h-[min(50.8vw,500px)] bg-white" aria-label="University students">
        <CampusIllustration />
      </section>

      <section className="relative z-20 min-h-[calc(100dvh-500px)] px-[13px] bg-[#F97316]">
        <div className="absolute z-[-1] top-[-20px] left-[-50px] w-[125%] h-25 rounded-t-[50%] rounded-b-none bg-[#F97316]" />
        <div className="w-full z-1 pt-[20px]">
          <h1 className="text-center text-[27px] font-normal leading-normal text-white" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
            Your details
          </h1>

          <div className="mt-[25px] flex w-full flex-col gap-[23px] rounded-[24px] border border-[#fed7aa] bg-white p-[28px_24px] shadow-[0_4px_12px_rgba(66,20,8,0.06)]">
            <div className="flex flex-col gap-0">
              <div className={`flex h-[58px] w-full items-center gap-[12px] overflow-clip rounded-[14px] border bg-white px-[14px] py-[10px] ${error && name.trim().length < 2 ? "border-red-500" : "border-[#fed7aa]"} ${shake && name.trim().length < 2 ? "animate-[shake_0.4s_ease-in-out]" : ""}`}>
                <div className="flex size-[36px] shrink-0 items-center justify-center overflow-clip rounded-[10px] bg-[#feedd2]">
                  <User className="size-[18px] text-[#f97316]" />
                </div>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="min-w-0 flex-1 border-0 bg-transparent text-[15px] font-light leading-normal text-[#334155] outline-none" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }} />
              </div>
            </div>

            <div className="flex flex-col gap-0">
              <button onClick={() => router.push("/student/select-university")} className={`flex h-[58px] w-full items-center gap-[12px] overflow-clip rounded-[14px] border bg-white px-[14px] py-[10px] ${error && university.trim().length < 1 ? "border-red-500" : "border-[#fed7aa]"} ${shake && university.trim().length < 1 ? "animate-[shake_0.4s_ease-in-out]" : ""}`}>
                <div className="flex size-[36px] shrink-0 items-center justify-center overflow-clip rounded-[10px] bg-[#feedd2]">
                  <GraduationCap className="size-[18px] text-[#f97316]" />
                </div>
                <span className="min-w-0 flex-1 text-left text-[15px] font-light text-[#989FA9]">{university || "Select university"}</span>
                <ChevronRight className="size-[18px] text-[#64748b]" />
              </button>
            </div>

            <div className="flex flex-col gap-0">
              <div className="flex h-[58px] w-full items-center gap-[12px] overflow-clip rounded-[14px] border border-[#fed7aa] bg-white px-[14px] py-[10px]">
                <div className="flex size-[36px] shrink-0 items-center justify-center overflow-clip rounded-[10px] bg-[#feedd2]">
                  <MapPin className="size-[18px] text-[#f97316]" />
                </div>
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address (optional)" className="min-w-0 flex-1 border-0 bg-transparent text-[15px] font-light leading-normal text-[#334155] outline-none" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }} />
              </div>
            </div>

            <button onClick={submit} className="flex h-[51px] w-full items-center justify-center gap-[10px] overflow-clip rounded-[16px] border border-[#f97316] bg-[#f97316] p-[16px] text-[15px] font-medium text-white">
              Start exploring
              <ArrowRight className="size-[18px]" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
