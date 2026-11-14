"use client";

import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin } from "lucide-react";
import { PageLoader } from "@/components/shared/page-loader";
import { EditInfoDialog } from "@/features/student/components/profile/edit-info-dialog";
import { AmenitiesCard } from "@/features/student/components/profile/amenities-card";
import { PreferenceMenu } from "@/features/student/components/profile/preference-menu";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { SignOutDialog } from "@/features/student/components/profile/sign-out-dialog";
import { getStudentProfile } from "@/services/student";
import { useProfileStore } from "@/stores/profile-store";
import { useAdminOptionsStore } from "@/stores/admin-options-store";


export default function StudentProfilePage() {
  const { data: profile } = useQuery({
    queryKey: ["student", "profile"],
    queryFn: getStudentProfile,
  });

  const name = useProfileStore((state) => state.name);
  const location = useProfileStore((state) => state.location);
  const image = useProfileStore((state) => state.image);
  const studyStyle = useProfileStore((state) => state.studyStyle);
  const noiseLevel = useProfileStore((state) => state.noiseLevel);
  const studyType = useProfileStore((state) => state.studyType);
  const amenities = useProfileStore((state) => state.amenities);
  const setDetails = useProfileStore((state) => state.setDetails);
  const setStudyStyle = useProfileStore((state) => state.setStudyStyle);
  const setNoiseLevel = useProfileStore((state) => state.setNoiseLevel);
  const setStudyType = useProfileStore((state) => state.setStudyType);
  const addAmenity = useProfileStore((state) => state.addAmenity);
  const removeAmenity = useProfileStore((state) => state.removeAmenity);
  const options = useAdminOptionsStore((state) => state.options);
  const activeOptions = (category: "noise" | "studyEnvironment" | "amenities") =>
    options
      .filter((option) => option.category === category && option.active)
      .sort((a, b) => a.order - b.order)
      .map((option) => option.label);

  if (!profile) {
    return <PageLoader className="min-h-[calc(100dvh-90px)] bg-[#fbfbfc] py-0" />;
  }

  return (
    <div className="min-h-screen w-[412px] mx-auto overflow-x-hidden bg-[#fbfbfc] px-[24px] pt-[20px] pb-[90px] flex flex-col gap-[20px]">
      <p className="text-[20px] font-bold leading-[25px] text-[#0f172a]">Profile</p>

      <div className="overflow-hidden rounded-[16px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
        <div className="h-20 bg-gradient-to-br from-orange-300 via-orange-100 to-orange-50" />
        <div className="relative px-4 pb-4">
          <div className="-mt-8 flex items-end justify-between gap-3">
            <ProfileAvatar
              name={name}
              imageUrl={image}
              className="size-16 border-4 border-white"
              textClassName="text-xl"
            />
            <EditInfoDialog
              name={name}
              location={location}
              image={image}
              onSave={setDetails}
              triggerLabel="Edit profile"
              triggerClassName="flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 text-xs font-semibold text-orange-700 transition hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              triggerTextClassName="text-xs font-semibold"
            />
          </div>
          <div className="mt-3 min-w-0">
            <h2 className="truncate text-lg font-bold text-[#0f172a]">{name}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-[#64748b]">
              <Mail aria-hidden="true" className="size-3.5 shrink-0" />
              <span className="min-w-0 truncate">{profile.email}</span>
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-[#64748b]">
              <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
              <span className="min-w-0 truncate">{location}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[8px]">
        <div className="flex items-center gap-[8px]">
          <img alt="" className="size-[16px] max-w-none" src="/assets/profile/6f0d0.svg" />
          <p className="text-[13px] font-medium text-[#64748b]">Study preferences</p>
        </div>
        <div className="flex flex-col overflow-clip rounded-[16px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
          <PreferenceMenu
            label="Study style"
            iconSrc="/assets/profile/f9268.svg"
            value={studyStyle}
            options={activeOptions("studyEnvironment")}
            onValueChange={setStudyStyle}
            withBorder
          />
          <PreferenceMenu
            label="Noise level"
            iconSrc="/assets/profile/28e38.svg"
            value={noiseLevel}
            options={activeOptions("noise")}
            onValueChange={setNoiseLevel}
            withBorder
          />
          <PreferenceMenu
            label="Study type"
            iconSrc="/assets/profile/59cad.svg"
            value={studyType}
            options={activeOptions("studyEnvironment")}
            onValueChange={setStudyType}
          />
        </div>
      </div>

      <div className="flex flex-col gap-[8px]">
        <div className="flex items-center gap-[8px]">
          <img alt="" className="size-[16px] max-w-none" src="/assets/profile/6885d.svg" />
          <p className="text-[13px] font-medium text-[#64748b]">Required amenities</p>
        </div>
        <AmenitiesCard
          amenities={amenities}
          availableOptions={activeOptions("amenities")}
          onAddAmenity={addAmenity}
          onRemoveAmenity={removeAmenity}
        />
      </div>

      <SignOutDialog />
    </div>
  );
}
