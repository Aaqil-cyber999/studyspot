"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { z } from "zod";
import { AdminPageHeader } from "@/components/navigation/admin-page-header";
import { createUaLocation } from "@/services/university-admin";

const schema = z.object({
  name: z.string().min(2, "Enter a location name"),
  building: z.string().min(2, "Enter a building"),
});

export default function AddLocationPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [building, setBuilding] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const result = schema.safeParse({ name, building });
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid";
      setError(message);
      toast.error(message);
      return;
    }
    setError(null);
    await createUaLocation(result.data);
    toast.success("Location added");
    router.push("/university-admin/locations");
  }

  return (
    <div className="min-h-screen bg-white pb-[90px]">
      <AdminPageHeader title="Add location" subtitle="Add a study space for students" backHref="/university-admin/locations" />
      <form className="space-y-[16px] px-[24px] pt-[8px]" onSubmit={(event) => { event.preventDefault(); void submit(); }}>
        <label className="block text-[13px] font-medium text-[#334155]">Location name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Central Library Study Zone"
          className="mt-[6px] w-full rounded-[12px] border border-[#e2e8f0] px-[14px] py-[12px] text-[14px] text-[#0f172a] outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#fed7aa]"
        />
        </label>
        <label className="block text-[13px] font-medium text-[#334155]">Building
        <input
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
          placeholder="e.g. Library"
          className="mt-[6px] w-full rounded-[12px] border border-[#e2e8f0] px-[14px] py-[12px] text-[14px] text-[#0f172a] outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#fed7aa]"
        />
        </label>
        {error ? <p role="alert" className="text-[13px] text-[#dc2626]">{error}</p> : null}
        <button type="submit" className="w-full rounded-[16px] bg-[#f97316] py-[14px] text-[15px] font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]">
          Save
        </button>
      </form>
    </div>
  );
}