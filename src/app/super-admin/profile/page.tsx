"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageLoader } from "@/components/shared/page-loader";
import { getSaProfile } from "@/services/super-admin";
import { MapPin } from "lucide-react";
import { EditProfileDialog } from "@/features/university-admin/components/edit-profile-dialog";
import toast from "react-hot-toast";

export default function SaProfilePage() {
  const { data: profile } = useQuery({ queryKey: ["sa", "profile"], queryFn: getSaProfile });
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);

  if (!profile) {
    return <PageLoader className="min-h-screen bg-[#E2E8F0] py-0" />;
  }

  return (
    <div className="min-h-screen bg-[#E2E8F0] px-4 sm:px-6">
      <header className="pb-4 pt-[16px]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Profile</h1>
            </div>
          </div>
        </header>

        <div className="space-y-4 pb-[90px]">
          <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <div className="h-20 bg-gradient-to-br from-orange-300 via-orange-100 to-orange-50" />
            <div className="relative px-4 pb-4">
              <div className="-mt-8 flex items-end justify-between">
                <div className="flex size-16 items-center justify-center rounded-full border-4 border-white bg-[#f97316] text-xl font-bold text-white shadow-sm">{image ? <MapPin className="size-4" /> : "SA"}</div>
                <EditProfileDialog
                  name={name}
                  image={image}
                  onSave={(values) => {
                    setName(values.name);
                    setImage(values.image);
                    toast.success("Profile changes saved");
                  }}
                  triggerClassName="flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 text-xs font-semibold text-orange-700 transition hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                  triggerTextClassName="text-xs font-semibold"
                />
              </div>
              <div className="mt-3">
                <h2 className="text-lg font-bold text-[#0f172a]">{name || profile.name}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-[#64748b]">
                  <MapPin className="size-3.5" /> University of Moratuwa
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-[#64748b]">{profile.email}</p>
              </div>
            </div>
          </section>
        </div>
    </div>
  );
}
