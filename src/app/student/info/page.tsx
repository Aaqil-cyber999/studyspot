"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, GraduationCap, MapPin, ChevronRight, ArrowRight } from "lucide-react";
import { chooseUniversitySchema } from "@/features/student/schemas";

const asset = (name: string) => `/assets/${name}.svg`;

function CampusIllustration() {
  return (
    <div className="art-canvas absolute top-0 left-1/2 w-[min(100%,412px)] aspect-[412/397] -translate-x-1/2" aria-hidden="true">
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

export default function InfoPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const result = chooseUniversitySchema.safeParse({ name, university, address });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setError(null);
    router.push("/student/select-university");
  }

  return (
    <main className="min-h-screen w-[412px] mx-auto overflow-x-hidden overflow-y-auto bg-white">
      <section className="relative z-10 min-h-[390px] h-[min(50.8vw,500px)] bg-white" aria-label="University students">
        <CampusIllustration />
      </section>

      <section className="relative z-20 min-h-[calc(100dvh-500px)] px-[13px] bg-[#F97316]">
        <div className="absolute z-[-1] top-[-35px] left-[-10px] w-[105%] h-25 rounded-t-[50%] rounded-b-none bg-[#F97316]" />
        <div className="w-full z-1">
          <h1 className="text-center text-[27px] font-normal leading-normal text-white" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
            Your details
          </h1>

          <div className="mt-[25px] flex w-full flex-col gap-[23px] rounded-[24px] border border-[#fed7aa] bg-white p-[28px_24px] shadow-[0_4px_12px_rgba(66,20,8,0.06)]">
            <div className="flex flex-col gap-0">
              <div className="flex h-[58px] w-full items-center gap-[12px] overflow-clip rounded-[14px] border border-[#fed7aa] bg-white px-[14px] py-[10px]">
                <div className="flex size-[36px] shrink-0 items-center justify-center overflow-clip rounded-[10px] bg-[#feedd2]">
                  <User className="size-[18px] text-[#f97316]" />
                </div>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="min-w-0 flex-1 border-0 bg-transparent text-[15px] font-light leading-normal text-[#334155] outline-none" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }} />
              </div>
            </div>

            <div className="flex flex-col gap-0">
              <button onClick={() => router.push("/student/select-university")} className="flex h-[58px] w-full items-center gap-[12px] overflow-clip rounded-[14px] border border-[#fed7aa] bg-white px-[14px] py-[10px]">
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

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

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
