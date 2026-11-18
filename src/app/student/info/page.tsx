"use client";

import { useInfoStore } from "@/stores/info-store";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { User, MapPin, Landmark, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { chooseUniversitySchema } from "@/features/student/schemas";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { useProfileStore } from "@/stores/profile-store";
import { SelectUniversityDialog } from "@/features/student/components/info/select-university-dialog";
import { api, ApiError } from "@/services/api";


function CampusIllustration() {
  return (
    <div className="absolute inset-0 w-full flex items-center justify-center" aria-hidden="true">
      <div className="relative h-full w-[min(80%,280px)] aspect-[412/397]">
        <img className="absolute inset-0 block size-full" src="/assets/info/illustration.svg" alt="" />
      </div>
    </div>
  );
}

export default function InfoPage() {
  const router = useRouter();
  const { name, setName, address, setAddress, faculty, setFaculty, error, setError, shake, setShake } = useInfoStore();
  const university = useOnboardingStore((state) => state.university);
  const universityId = useOnboardingStore((state) => state.universityId);
  const queryClient = useQueryClient();

  async function submit() {
    const result = chooseUniversitySchema.safeParse({ name, university, faculty, address });
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid input";
      setError(message);
      toast.error(message);
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    setError(null);
    try {
      await api.put("/users/me", {
        name: result.data.name.trim(),
        address: result.data.address?.trim() || null,
        universityId: universityId ?? undefined,
        faculty: result.data.faculty.trim(),
      });
      // Reflect the new values in the profile cache right away.
      useProfileStore.getState().hydrateFromApiPartial({
        name: result.data.name.trim(),
        address: result.data.address?.trim() || null,
        faculty: result.data.faculty.trim(),
      });
      // Make Discover and the profile see the new university immediately.
      await queryClient.invalidateQueries({ queryKey: ["student"] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Details saved");
      router.push("/student/home");
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Unable to save your details. Please try again.";
      setError(message);
      toast.error(message);
    }
  }
  return (
    <main className="flex min-h-dvh w-full md:max-w-[412px] mx-auto flex-col overflow-y-auto bg-[#F97316]">
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`}</style>
      <section className="relative h-[240px] shrink-0 bg-[#E2E8F0] sm:h-[280px]" aria-label="University students">
        <CampusIllustration />
      </section>

      <section className="relative flex-1 px-[13px] pt-2 pb-6 bg-[#F97316]">
        <div className="absolute z-[-1] top-[-26px] left-[-10px] w-[105%] h-[42px] rounded-t-[50%] rounded-b-none bg-[#F97316]" />
        <div className="-mt-[10px] w-full z-1">
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
              <SelectUniversityDialog
                error={Boolean(error && university.trim().length < 1)}
                shake={Boolean(shake && university.trim().length < 1)}
              />
            </div>

            <div className="flex flex-col gap-0">
              <div className={`flex h-[58px] w-full items-center gap-[12px] overflow-clip rounded-[14px] border bg-white px-[14px] py-[10px] ${error && faculty.trim().length < 2 ? "border-red-500" : "border-[#fed7aa]"} ${shake && faculty.trim().length < 2 ? "animate-[shake_0.4s_ease-in-out]" : ""}`}>
                <div className="flex size-[36px] shrink-0 items-center justify-center overflow-clip rounded-[10px] bg-[#feedd2]">
                  <Landmark className="size-[18px] text-[#f97316]" />
                </div>
                <input value={faculty} onChange={(e) => setFaculty(e.target.value)} placeholder="Faculty" aria-label="Faculty" className="min-w-0 flex-1 border-0 bg-transparent text-[15px] font-light leading-normal text-[#334155] outline-none placeholder:text-[#94a3b8]" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }} />
              </div>
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
