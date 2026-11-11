"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import { studySpotCatalog } from "@/mocks/data/study-spots";
import { useUniversityAdminStore } from "@/stores/university-admin-store";

const schema = z.object({
  name: z.string().min(2, "Enter a location name"),
  building: z.string().min(2, "Enter a building"),
});

export default function AddLocationPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [building, setBuilding] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const addLocation = useUniversityAdminStore((state) => state.addLocation);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = schema.safeParse({ name, building });
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid";
      setError(message);
      toast.error(message);
      return;
    }
    setError(null);
    setConfirmOpen(true);
  }

  function confirmAdd() {
    const mockImage =
      studySpotCatalog[(name.trim().length + building.trim().length) % studySpotCatalog.length]
        ?.imageUrls[0];

    addLocation({
      name: name.trim(),
      building: building.trim(),
      area: building.trim(),
      hours: "Open 8 AM–10 PM",
      status: "Active",
      seats: "Unsure",
      wifi: "Medium",
      crowd: "Medium",
      noise: "Moderate",
      description: `A student study space in the ${building.trim()} building.`,
      category: "Study space",
      amenities: ["Wi-Fi", "Power outlet"],
      imageUrls: mockImage ? [mockImage] : [],
    });
    toast.success("Location added");
    router.push("/university-admin/locations");
  }

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <div className="flex items-center gap-3 px-[24px] pb-[16px] pt-[16px]">
        <button onClick={() => router.back()} className="flex size-9 items-center justify-center rounded-full border border-[#e2e8f0] bg-white">
          <ArrowLeft className="size-5 text-[#0f172a]" />
        </button>
        <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Add location</h1>
      </div>
      <form onSubmit={submit} className="space-y-[16px] px-[24px]">
        <div className="space-y-[12px] rounded-[20px] border border-[#e2e8f0] bg-white p-[20px] shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#334155]">Location name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Central Library Study Zone"
              className="w-full rounded-[14px] border border-[#e2e8f0] px-[16px] py-[12px] text-[14px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
            />
          </div>
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#334155]">Building</label>
            <input
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              placeholder="e.g., Library Building"
              className="w-full rounded-[14px] border border-[#e2e8f0] px-[16px] py-[12px] text-[14px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
            />
          </div>
          {error ? <p className="text-[13px] text-red-500">{error}</p> : null}
        </div>
        <button type="submit" className="w-full rounded-[16px] bg-[#f97316] py-[14px] text-[14px] font-medium text-white shadow-[0px_6px_16px_rgba(249,115,22,0.25)]">
          Save location
        </button>
      </form>
      <AdminConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Add this location?"
        description={`Students will see ${name.trim()} under ${building.trim()}. You can edit its details and status after adding it.`}
        confirmLabel="Add location"
        onConfirm={confirmAdd}
      />
    </div>
  );
}