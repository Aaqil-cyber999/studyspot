"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import { useUniversityAdminStore, type AdminLocation } from "@/stores/university-admin-store";
import { useAdminOptionsStore } from "@/stores/admin-options-store";

const schema = z.object({
  name: z.string().trim().min(2, "Enter a location name"),
  building: z.string().trim().min(2, "Enter a building"),
  area: z.string().trim().min(2, "Enter an area"),
  description: z.string().trim().min(10, "Add a short description"),
  hours: z.string().trim().min(3, "Enter operating hours"),
});

type FormValues = Omit<AdminLocation, "id" | "rating" | "reviews"> & {
  amenitiesText: string;
};

export default function EditLocationPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const location = useUniversityAdminStore((state) => state.locations.find((item) => item.id === params.id));
  const updateLocation = useUniversityAdminStore((state) => state.updateLocation);
  const options = useAdminOptionsStore((state) => state.options);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<FormValues | null>(() =>
    location
      ? {
          ...location,
          amenitiesText: location.amenities.join(", "),
        }
      : null
  );

  if (!location || !values) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfbfc] px-6 text-center text-sm text-slate-500">
        Location not found.
      </div>
    );
  }

  const currentLocation = location;
  const currentValues = values;
  const availableOptions = (category: "wifi" | "noise" | "crowd" | "seats", currentValue: string) =>
    options
      .filter((option) => option.category === category && (option.active || option.label === currentValue))
      .sort((a, b) => a.order - b.order)
      .map((option) => option.label);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => (current ? { ...current, [key]: value } : current));
    setError(null);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = schema.safeParse(currentValues);
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Check the form";
      setError(message);
      toast.error(message);
      return;
    }

    const amenities = currentValues.amenitiesText
      .split(",")
      .map((amenity) => amenity.trim())
      .filter(Boolean);

    updateLocation(currentLocation.id, {
      name: currentValues.name.trim(),
      building: currentValues.building.trim(),
      area: currentValues.area.trim(),
      description: currentValues.description.trim(),
      hours: currentValues.hours.trim(),
      category: currentValues.category,
      seats: currentValues.seats,
      wifi: currentValues.wifi,
      crowd: currentValues.crowd,
      noise: currentValues.noise,
      status: currentValues.status,
      amenities,
    });
    toast.success("Location updated");
    router.push(`/university-admin/locations/${currentLocation.id}`);
  }

  return (
    <main className="min-h-screen bg-[#fbfbfc]">
      <header className="flex items-center gap-3 px-6 pb-4 pt-16">
        <button type="button" onClick={() => router.back()} aria-label="Go back" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
          <ArrowLeft className="size-5 text-slate-800" />
        </button>
        <div className="min-w-0">
          <p className="text-xs font-medium text-orange-600">Location management</p>
          <h1 className="truncate text-xl font-semibold text-slate-900">Edit location</h1>
        </div>
      </header>

      <form onSubmit={submit} className="space-y-4 px-6 pb-[120px]">
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Basic information</h2>
              <p className="mt-0.5 text-xs text-slate-400">Details students see on location cards</p>
            </div>
            <Star className="h-4 w-4 text-orange-500" />
          </div>
          <TextField label="Location name" value={values.name} onChange={(value) => update("name", value)} />
          <TextField label="Building" value={values.building} onChange={(value) => update("building", value)} />
          <TextField label="Area or floor" value={values.area} onChange={(value) => update("area", value)} />
          <TextField label="Operating hours" value={values.hours} onChange={(value) => update("hours", value)} placeholder="e.g. Open 8 AM–10 PM" />
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-slate-700">Description</span>
            <textarea value={values.description} onChange={(event) => update("description", event.target.value)} className="min-h-24 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
          </label>
          <SelectField label="Category" value={values.category} options={["Library", "Labs", "Study space"]} onChange={(value) => update("category", value as AdminLocation["category"])} />
          <TextField label="Amenities" value={values.amenitiesText} onChange={(value) => update("amenitiesText", value)} placeholder="Wi-Fi, Power outlet, Quiet seating" hint="Separate amenities with commas." />
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Student-facing status</h2>
            <p className="mt-0.5 text-xs text-slate-400">Keep these values aligned with student reports.</p>
          </div>
          <SelectField label="Location status" value={values.status} options={["Active", "Inactive"]} onChange={(value) => update("status", value as AdminLocation["status"])} />
          <SelectField label="Seats available" value={values.seats} options={availableOptions("seats", values.seats)} onChange={(value) => update("seats", value as AdminLocation["seats"])} />
          <SelectField label="Wi-Fi strength" value={values.wifi} options={availableOptions("wifi", values.wifi)} onChange={(value) => update("wifi", value as AdminLocation["wifi"])} />
          <SelectField label="Crowd level" value={values.crowd} options={availableOptions("crowd", values.crowd)} onChange={(value) => update("crowd", value as AdminLocation["crowd"])} />
          <SelectField label="Noise level" value={values.noise} options={availableOptions("noise", values.noise)} onChange={(value) => update("noise", value as AdminLocation["noise"])} />
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
            <div><p className="text-[10px] text-slate-400">Student rating</p><p className="mt-1 text-sm font-bold text-slate-700">{location.rating ? location.rating.toFixed(1) : "New"}</p></div>
            <div><p className="text-[10px] text-slate-400">Student reviews</p><p className="mt-1 text-sm font-bold text-slate-700">{location.reviews}</p></div>
          </div>
          {error ? <p role="alert" className="text-xs text-red-600">{error}</p> : null}
        </section>

        <button type="submit" className="w-full rounded-2xl bg-orange-500 py-3.5 text-sm font-bold text-white shadow-[0_6px_16px_rgba(249,115,22,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2">
          Save all changes
        </button>
      </form>
    </main>
  );
}

function TextField({ label, value, onChange, placeholder, hint }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-slate-700">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
      {hint ? <span className="mt-1 block text-[11px] text-slate-400">{hint}</span> : null}
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-slate-700">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}
