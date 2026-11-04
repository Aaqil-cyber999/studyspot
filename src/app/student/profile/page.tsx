"use client";

import { useQuery } from "@tanstack/react-query";
import { PageLoader } from "@/components/shared/page-loader";
import { EditInfoDialog } from "@/features/student/components/profile/edit-info-dialog";
import { AmenitiesCard } from "@/features/student/components/profile/amenities-card";
import { PreferenceMenu } from "@/features/student/components/profile/preference-menu";
import { ProfileAvatar } from "@/features/student/components/profile/profile-avatar";
import { SignOutDialog } from "@/features/student/components/profile/sign-out-dialog";
import { getStudentProfile } from "@/services/student";
import { useProfileStore } from "@/stores/profile-store";

const STUDY_STYLE_OPTIONS = ["Quiet", "Focused", "Social"] as const;
const NOISE_LEVEL_OPTIONS = ["Low", "Medium", "High"] as const;
const STUDY_TYPE_OPTIONS = ["Individual", "Group", "Hybrid"] as const;

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

  if (!profile) {
    return <PageLoader className="min-h-[calc(100dvh-90px)] bg-[#fbfbfc] py-0" />;
  }

  return (
    <div className="min-h-screen w-[412px] mx-auto overflow-x-hidden overflow-y-auto bg-[#fbfbfc] px-[24px] pt-[20px] pb-[90px] flex flex-col gap-[20px]">
      <p className="text-[20px] font-bold leading-[25px] text-[#0f172a]">Profile</p>

      <div className="relative overflow-clip rounded-[16px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] p-[16px]">
        <div className="flex items-center gap-[14px]">
          <ProfileAvatar name={name} imageUrl={image} />
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <p className="text-[16px] font-semibold leading-[22px] text-[#0f172a]">{name}</p>
            <p className="text-[12px] leading-[18px] text-[#64748b]">{profile.email}</p>
            <div className="flex min-w-0 items-center pt-[2px]">
              <img alt="" className="size-[14px] shrink-0 max-w-none" src="/assets/profile/c613d.svg" />
              <p className="ml-1 min-w-0 truncate text-[15px] text-[#64748b]">{location}</p>
            </div>
          </div>
          <EditInfoDialog
            name={name}
            location={location}
            image={image}
            onSave={setDetails}
          />
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
            options={STUDY_STYLE_OPTIONS}
            onValueChange={setStudyStyle}
            withBorder
          />
          <PreferenceMenu
            label="Noise level"
            iconSrc="/assets/profile/28e38.svg"
            value={noiseLevel}
            options={NOISE_LEVEL_OPTIONS}
            onValueChange={setNoiseLevel}
            withBorder
          />
          <PreferenceMenu
            label="Study type"
            iconSrc="/assets/profile/59cad.svg"
            value={studyType}
            options={STUDY_TYPE_OPTIONS}
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
          onAddAmenity={addAmenity}
          onRemoveAmenity={removeAmenity}
        />
      </div>

      <SignOutDialog />
    </div>
  );
}
