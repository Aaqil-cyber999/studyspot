"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Enter a location name"),
  building: z.string().min(2, "Enter a building"),
});

export default function AddLocationPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [building, setBuilding] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const result = schema.safeParse({ name, building });
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid";
      setError(message);
      toast.error(message);
      return;
    }
    setError(null);
    toast.success("Location added");
    router.push("/university-admin/locations");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex items-center gap-3 bg-white px-4 py-3">
        <button onClick={() => router.back()} className="flex size-10 items-center justify-center rounded-full bg-slate-100">
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-lg font-semibold text-slate-900">Add Location</h1>
      </div>
      <div className="space-y-4 p-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Location name"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
        />
        <input
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
          placeholder="Building"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
        />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button onClick={submit} className="w-full rounded-2xl bg-orange-500 py-4 font-medium text-white">
          Save
        </button>
      </div>
    </div>
  );
}