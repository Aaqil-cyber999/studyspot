"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudentProfile } from "@/services/student";

export default function StudentProfilePage() {
  const { data: profile } = useQuery({
    queryKey: ["student", "profile"],
    queryFn: getStudentProfile,
  });

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="relative min-h-screen w-full max-w-md mx-auto overflow-y-auto bg-[#fbfbfc]">
      <div className="absolute left-0 top-[52px] flex h-[787px] w-[412px] flex-col gap-[20px] overflow-clip px-[24px] py-[20px]">
        <div className="flex items-center justify-between">
          <p className="text-[20px] font-bold leading-[25px] text-[#0f172a]">Profile</p>
          <div className="flex size-[36px] items-center justify-center rounded-[18px] border border-[#e2e8f0] bg-white">
            <img alt="" className="size-[18px] max-w-none" src="/assets/profile/6df05.svg" />
          </div>
        </div>

        <div className="relative h-[99px] overflow-clip rounded-[16px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
          <div className="absolute left-[16px] top-[20.5px] flex size-[56px] items-center justify-center overflow-clip rounded-full bg-[#f97316]">
            <p className="text-[18px] font-semibold text-white">AS</p>
          </div>
          <div className="absolute left-[86px] top-[16px] flex h-[65px] w-[195px] flex-col gap-[2px] overflow-clip">
            <p className="text-[16px] font-semibold leading-[22px] text-[#0f172a]">{profile.name}</p>
            <p className="text-[12px] leading-[18px] text-[#64748b]">{profile.email}</p>
            <div className="flex items-center pt-[2px]">
              <img alt="" className="size-[14px] max-w-none" src="/assets/profile/c613d.svg" />
              <p className="ml-1 text-[15px] text-[#64748b]">{profile.address}</p>
            </div>
          </div>
          <button className="absolute left-[276px] top-[19.5px] flex items-center gap-[6px] rounded-[8px] bg-[#ddd] px-[10px] py-[4px]">
            <img alt="" className="size-[16px] max-w-none" src="/assets/profile/3d68c.svg" />
            <p className="text-[14px] font-medium text-black">Edit</p>
          </button>
        </div>

        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center gap-[8px]">
            <img alt="" className="size-[16px] max-w-none" src="/assets/profile/6f0d0.svg" />
            <p className="text-[13px] font-medium text-[#64748b]">Study preferences</p>
          </div>
          <div className="flex cursor-pointer flex-col overflow-clip rounded-[16px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
            <button className="flex items-center justify-between border-b border-[#e2e8f0] px-[16px] py-[15px]">
              <div className="flex items-center gap-[12px]">
                <img alt="" className="size-[20px] max-w-none" src="/assets/profile/f9268.svg" />
                <p className="text-[14px] text-[#334155]">Study style</p>
              </div>
              <div className="flex items-center gap-[6px]">
                <p className="text-[14px] font-medium text-[#0f172a]">{profile.studyStyle}</p>
                <img alt="" className="size-[16px] max-w-none" src="/assets/profile/23186.svg" />
              </div>
            </button>
            <button className="flex items-center justify-between border-b border-[#e2e8f0] px-[16px] py-[15px]">
              <div className="flex items-center gap-[12px]">
                <img alt="" className="size-[20px] max-w-none" src="/assets/profile/28e38.svg" />
                <p className="text-[14px] text-[#334155]">Noise level</p>
              </div>
              <div className="flex items-center gap-[6px]">
                <p className="text-[14px] font-medium text-[#0f172a]">{profile.noiseLevel}</p>
                <img alt="" className="size-[16px] max-w-none" src="/assets/profile/23186.svg" />
              </div>
            </button>
            <button className="flex items-center justify-between px-[16px] py-[15px]">
              <div className="flex items-center gap-[12px]">
                <img alt="" className="size-[20px] max-w-none" src="/assets/profile/59cad.svg" />
                <p className="text-[14px] text-[#334155]">Study type</p>
              </div>
              <div className="flex items-center gap-[6px]">
                <p className="text-[14px] font-medium text-[#0f172a]">{profile.studyType}</p>
                <img alt="" className="size-[16px] max-w-none" src="/assets/profile/23186.svg" />
              </div>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center gap-[8px]">
            <img alt="" className="size-[16px] max-w-none" src="/assets/profile/6885d.svg" />
            <p className="text-[13px] font-medium text-[#64748b]">Required amenities</p>
          </div>
          <div className="flex flex-wrap gap-[8px] rounded-[16px] border border-[#e2e8f0] bg-white p-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
            {profile.amenities.map((a) => (
              <span key={a} className="rounded-full bg-[#fff7ed] px-[12px] py-[6px] text-[12px] font-medium text-[#f97316]">
                {a}
              </span>
            ))}
            <button className="flex size-[32px] items-center justify-center rounded-full border border-[#e2e8f0] text-[#64748b]">
              +
            </button>
          </div>
        </div>

        <button className="w-full rounded-[10px] bg-[#f97316] py-[14px] text-[14px] font-medium text-white">
          Save changes
        </button>
      </div>
    </div>
  );
}