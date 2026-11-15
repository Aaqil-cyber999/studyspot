"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, ImagePlus, Images, MapPinned, ChevronLeft, ChevronRight, X, Clock, TrendingUp, LayoutGrid, Check, Plus, UserCheck, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { TimePicker, formatTimeLabel } from "@/components/ui/time-picker";
import toast from "react-hot-toast";
import { z } from "zod";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import { useLocationPreviewStore } from "@/stores/location-preview-store";
import { useUniversityAdminStore } from "@/stores/university-admin-store";
import { studySpotCatalog } from "@/mocks/data/study-spots";

const schema = z.object({
  name: z.string().min(2, "Enter a location name"),
  building: z.string().min(2, "Enter a building"),
});

type OpenTimeMode = "always" | "custom";

const MAX_IMAGES = 5;

const AMENITY_OPTIONS = [
  "Wi-Fi",
  "Power outlets",
  "Computers",
  "Printer",
  "Cafeteria",
  "Parking",
  "Elevator",
  "Accessible seating",
  "Quiet zone",
  "Group tables",
];

const DEFAULT_AMENITIES = ["Wi-Fi", "Power outlets"];

interface ImageItem {
  url: string;
  file: File | null;
}

export default function EditLocationPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const location = useUniversityAdminStore((state) => state.locations.find((item) => item.id === params.id));
  const updateLocation = useUniversityAdminStore((state) => state.updateLocation);
  const setLocationPreview = useLocationPreviewStore((state) => state.setData);

  const [name, setName] = useState(location?.name ?? "");
  const [building, setBuilding] = useState(location?.building ?? "");
  const [faculty, setFaculty] = useState(location?.faculty ?? "");
  const [description, setDescription] = useState(location?.description ?? "");
  const [department, setDepartment] = useState(location?.department ?? "");
  const [staffMonitored, setStaffMonitored] = useState(location?.staffMonitored ?? false);
  const [amenities, setAmenities] = useState<string[]>(location?.amenities ?? [...DEFAULT_AMENITIES]);
  const [amenityOptions, setAmenityOptions] = useState<string[]>(() => {
    const base = [...AMENITY_OPTIONS];
    const extra = (location?.amenities ?? []).filter((a) => !base.includes(a));
    return [...base, ...extra];
  });
  const [customAmenity, setCustomAmenity] = useState("");
  const [customAmenityOpen, setCustomAmenityOpen] = useState(false);
  const customAmenityInputRef = useRef<HTMLInputElement>(null);
  const customAmenityTriggerRef = useRef<HTMLButtonElement>(null);
  const customAmenityTouchedRef = useRef(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [imageItems, setImageItems] = useState<ImageItem[]>(() => {
    if (location?.imageUrls && location.imageUrls.length > 0) {
      return location.imageUrls.map((url) => ({ url, file: null }));
    }
    return [];
  });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Opening hours state
  const [openTimeMode, setOpenTimeMode] = useState<OpenTimeMode>(() => {
    if (!location) return "custom";
    return location.hours === "24/7" ? "always" : "custom";
  });
  const [openTime, setOpenTime] = useState(() => {
    if (!location || location.hours === "24/7") return "08:00";
    const match = location.hours.match(/^(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})$/);
    if (match) {
      const [, h1, m1] = match;
      return `${h1.padStart(2, "0")}:${m1}`;
    }
    return "08:00";
  });
  const [closeTime, setCloseTime] = useState(() => {
    if (!location || location.hours === "24/7") return "22:00";
    const match = location.hours.match(/^(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})$/);
    if (match) {
      const [, , , h2, m2] = match;
      return `${h2.padStart(2, "0")}:${m2}`;
    }
    return "22:00";
  });

  // Peak hours state
  const [peakEnabled, setPeakEnabled] = useState(false);
  const [peakStart, setPeakStart] = useState("12:00");
  const [peakEnd, setPeakEnd] = useState("14:00");

  const isAlwaysOpen = openTimeMode === "always";
  const hoursString = isAlwaysOpen ? "24/7" : `${formatTimeLabel(openTime)} – ${formatTimeLabel(closeTime)}`;
  const imagesFull = imageItems.length >= MAX_IMAGES;
  const previewUrls = imageItems.map((item) => item.url);

  // Reset carousel index when previews change
  useEffect(() => {
    setCurrentIdx(0);
  }, [imageItems.length]);

  function toggleAmenity(amenity: string) {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity],
    );
  }

  function addCustomAmenity() {
    const value = customAmenity.trim().replace(/\s+/g, " ");
    if (!value) return;
    const existing = amenityOptions.find((item) => item.toLowerCase() === value.toLowerCase());
    const amenity = existing ?? value;
    if (!existing) {
      setAmenityOptions((prev) => [...prev, value]);
    }
    setAmenities((prev) => (prev.includes(amenity) ? prev : [...prev, amenity]));
    setCustomAmenity("");
    setCustomAmenityOpen(false);
  }

  function cancelCustomAmenity() {
    setCustomAmenity("");
    setCustomAmenityOpen(false);
  }

  useEffect(() => {
    if (!customAmenityTouchedRef.current) {
      customAmenityTouchedRef.current = true;
      return;
    }
    if (customAmenityOpen) {
      customAmenityInputRef.current?.focus();
    } else {
      customAmenityTriggerRef.current?.focus();
    }
  }, [customAmenityOpen]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = schema.safeParse({ name, building });
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid";
      toast.error(message);
      return;
    }
    if (imageItems.length === 0) {
      toast.error("Upload at least one image");
      return;
    }
    setError(null);
    setConfirmOpen(true);
  }

  async function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 800;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height / width) * maxDim);
            width = maxDim;
          } else {
            width = Math.round((width / height) * maxDim);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context unavailable"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          },
          "image/jpeg",
          0.7,
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }

  async function confirmEdit() {
    const compressed: string[] = [];
    for (const item of imageItems) {
      if (item.file) {
        try {
          const dataUrl = await compressImage(item.file);
          compressed.push(dataUrl);
        } catch (e) {
          console.error("Image compression error", e);
        }
      } else {
        compressed.push(item.url);
      }
    }
    const imageUrls = compressed.length > 0 ? compressed : undefined;

    updateLocation(location!.id, {
      name: name.trim(),
      building: building.trim(),
      faculty: faculty.trim() || undefined,
      department: department.trim() || undefined,
      description: description.trim() || undefined,
      staffMonitored,
      area: building.trim(),
      hours: hoursString,
      amenities,
      imageUrls,
    });
    toast.success("Location updated");
    router.push(`/university-admin/locations/${location!.id}`);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const remaining = Math.max(MAX_IMAGES - imageItems.length, 0);
    const selected = Array.from(files).slice(0, remaining);
    if (files.length > remaining) {
      toast.error(`You can upload up to ${MAX_IMAGES} images`);
    }
    const newItems = selected.map((file) => ({ url: URL.createObjectURL(file), file }));
    setImageItems((prev) => [...prev, ...newItems]);
    e.target.value = "";
  }

  function removeImage(idx: number) {
    setImageItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function showPreviousImage() {
    setCurrentIdx((idx) => (idx - 1 + previewUrls.length) % previewUrls.length);
  }

  function showNextImage() {
    setCurrentIdx((idx) => (idx + 1) % previewUrls.length);
  }

  if (!location) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfbfc] px-6 text-center">
        <p className="text-sm text-slate-500">This location could not be found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <div className="flex items-center gap-3 px-[24px] pb-[16px] pt-[16px]">
        <button onClick={() => router.back()} className="flex size-9 items-center justify-center rounded-full border border-[#e2e8f0] bg-white">
          <ArrowLeft className="size-5 text-[#0f172a]" />
        </button>
        <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Edit location</h1>
      </div>
      <form onSubmit={submit} className="px-[24px]">
        <div className="space-y-[12px] rounded-[20px] border border-[#e2e8f0] bg-white p-[20px] shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#334155]">Location name <span className="text-red-500">*</span></label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Central Library Study Zone" className="w-full rounded-[14px] border border-[#e2e8f0] px-[16px] py-[12px] text-[14px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]" />
          </div>
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#334155]">Building <span className="text-red-500">*</span></label>
            <input value={building} onChange={(e) => setBuilding(e.target.value)} placeholder="e.g., Library Building" className="w-full rounded-[14px] border border-[#e2e8f0] px-[16px] py-[12px] text-[14px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]" />
          </div>
          <div>
            <label htmlFor="faculty" className="mb-2 block text-[13px] font-medium text-[#334155]">
              Faculty <span className="font-normal text-[#94a3b8]">(optional)</span>
            </label>
            <input id="faculty" value={faculty} onChange={(e) => setFaculty(e.target.value)} placeholder="e.g., Faculty of Information Technology" className="w-full rounded-[14px] border border-[#e2e8f0] px-[16px] py-[12px] text-[14px] text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus-visible:border-[#f97316] focus-visible:ring-2 focus-visible:ring-[#f97316]/40" />
          </div>
          <div>
            <label htmlFor="department" className="mb-2 block text-[13px] font-medium text-[#334155]">
              Department <span className="font-normal text-[#94a3b8]">(optional)</span>
            </label>
            <input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g., Computer Science" className="w-full rounded-[14px] border border-[#e2e8f0] px-[16px] py-[12px] text-[14px] text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus-visible:border-[#f97316] focus-visible:ring-2 focus-visible:ring-[#f97316]/40" />
          </div>
          <div>
            <label htmlFor="description" className="mb-2 block text-[13px] font-medium text-[#334155]">
              Description <span className="font-normal text-[#94a3b8]">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., A quiet study space with natural lighting and comfortable seating"
              rows={3}
              className="w-full resize-none rounded-[14px] border border-[#e2e8f0] px-[16px] py-[12px] text-[14px] text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus-visible:border-[#f97316] focus-visible:ring-2 focus-visible:ring-[#f97316]/40"
            />
          </div>

          {/* Staff monitored */}
          <div className="flex items-center justify-between rounded-[14px] border border-[#e2e8f0] px-[16px] py-[12px]">
            <div className="flex items-center gap-2">
              <UserCheck size={16} className="text-[#0f172a]" />
              <span className="text-[13px] font-medium text-[#334155]">Staff monitored</span>
            </div>
            <Switch checked={staffMonitored} onCheckedChange={setStaffMonitored} />
          </div>

          {/* Amenities */}
          <div className="space-y-[12px] rounded-[14px] border border-[#e2e8f0] p-[14px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutGrid className="size-4 text-[#0f172a]" />
                <span className="text-[13px] font-medium text-[#334155]">Amenities</span>
              </div>
              <span className="text-[12px] text-[#94a3b8]">{amenities.length} selected</span>
            </div>

            <div role="group" aria-label="Amenities" className="flex flex-wrap gap-[8px]">
              {[...amenityOptions].sort((a, b) => {
                const aSelected = amenities.includes(a);
                const bSelected = amenities.includes(b);
                if (aSelected && !bSelected) return -1;
                if (!aSelected && bSelected) return 1;
                return 0;
              }).map((amenity) => {
                const selected = amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-[6px] rounded-full border px-[12px] py-[6px] text-[12px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] ${
                      selected
                        ? "border-[#fa8c16] bg-[#fa8c16] text-white"
                        : "border-[#e2e8f0] bg-white text-[#334155] hover:bg-[#f8fafc]"
                    }`}
                  >
                    {selected && <Check size={12} className="text-white" />}
                    {amenity}
                  </button>
                );
              })}
            </div>

            {customAmenityOpen ? (
              <div className="flex items-center gap-[8px]">
                <input ref={customAmenityInputRef} value={customAmenity} onChange={(e) => setCustomAmenity(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomAmenity(); } else if (e.key === "Escape") { e.preventDefault(); cancelCustomAmenity(); } }} maxLength={30} placeholder="e.g., Whiteboards" aria-label="Custom amenity name" className="min-w-0 flex-1 rounded-[12px] border border-[#e2e8f0] bg-white px-[12px] py-[7px] text-[13px] text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus-visible:border-[#f97316] focus-visible:ring-2 focus-visible:ring-[#f97316]/40" />
                <button type="button" onClick={addCustomAmenity} disabled={!customAmenity.trim()} className={`shrink-0 rounded-[12px] px-[12px] py-[7px] text-[12px] font-medium text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] ${customAmenity.trim() ? "bg-[#f97316] hover:bg-[#ea580c]" : "cursor-not-allowed bg-[#f97316]/50"}`}>Add</button>
                <button type="button" onClick={cancelCustomAmenity} aria-label="Cancel adding a custom amenity" className="flex size-[30px] shrink-0 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#334155] outline-none hover:bg-[#f8fafc] focus-visible:ring-2 focus-visible:ring-[#f97316]"><X size={14} /></button>
              </div>
            ) : (
              <button ref={customAmenityTriggerRef} type="button" onClick={() => setCustomAmenityOpen(true)} className="flex w-full items-center justify-center gap-[6px] rounded-[12px] border border-dashed border-[#e2e8f0] bg-white py-[8px] text-[12px] font-medium text-[#f97316] outline-none transition-colors hover:border-[#f97316] hover:bg-[#fff7ed] focus-visible:ring-2 focus-visible:ring-[#f97316]">
                <Plus size={14} /> Add a custom amenity
              </button>
            )}
          </div>

          {/* Opening hours */}
          <div className="rounded-[14px] border border-[#e2e8f0] p-[14px] space-y-[12px]">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-[#0f172a]" />
              <span className="text-[13px] font-medium text-[#334155]">Opening hours <span className="text-red-500">*</span></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#64748b]">Always open (24/7)</span>
              <Switch checked={isAlwaysOpen} onCheckedChange={(val) => setOpenTimeMode(val ? "always" : "custom")} />
            </div>
            <div className={`space-y-[10px] transition-opacity ${isAlwaysOpen ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
              <div className="flex items-end gap-3">
                <div>
                  <label htmlFor="open-time" className="mb-1 block text-[12px] text-[#94a3b8]">Open</label>
                  <TimePicker id="open-time" aria-label="Open time" value={openTime} onChange={setOpenTime} />
                </div>
                <div>
                  <label htmlFor="close-time" className="mb-1 block text-[12px] text-[#94a3b8]">Close</label>
                  <TimePicker id="close-time" aria-label="Close time" value={closeTime} onChange={setCloseTime} />
                </div>
              </div>
              <p className="text-[12px] text-[#94a3b8]">
                Open: <span className="text-[#f97316] font-medium">{hoursString}</span>
              </p>
            </div>
            <div className="border-t border-[#e2e8f0]" />
            <div className="space-y-[10px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={15} className="text-[#f97316]" />
                  <span className="text-[13px] font-medium text-[#334155]">Peak hours</span>
                </div>
                <Switch checked={peakEnabled} onCheckedChange={setPeakEnabled} />
              </div>
              {peakEnabled && (
                <div className="space-y-[8px]">
                  <div className="flex items-end gap-3">
                    <div>
                      <label htmlFor="peak-start" className="mb-1 block text-[12px] text-[#94a3b8]">Peak start</label>
                      <TimePicker id="peak-start" aria-label="Peak start" value={peakStart} onChange={setPeakStart} />
                    </div>
                    <div>
                      <label htmlFor="peak-end" className="mb-1 block text-[12px] text-[#94a3b8]">Peak end</label>
                      <TimePicker id="peak-end" aria-label="Peak end" value={peakEnd} onChange={setPeakEnd} />
                    </div>
                  </div>
                  <p className="text-[12px] text-[#94a3b8]">
                    Peak: <span className="text-[#f97316] font-medium">{formatTimeLabel(peakStart)} – {formatTimeLabel(peakEnd)}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-[12px] rounded-[14px] border border-[#e2e8f0] p-[14px]">
            <label htmlFor="image-input" className="flex items-center gap-2">
              <Images size={16} className="text-[#0f172a]" />
              <span className="text-[13px] font-medium text-[#334155]">Images <span className="text-red-500">*</span></span>
              <span className="text-[12px] text-[#94a3b8]">{imageItems.length}/{MAX_IMAGES} · JPG/PNG</span>
            </label>
            <input id="image-input" type="file" accept="image/jpeg,image/png" multiple onChange={handleImageChange} className="hidden" />
            <button type="button" onClick={() => document.getElementById("image-input")?.click()} disabled={imagesFull} className={`flex items-center gap-2 rounded-[16px] bg-[#fa8c16] px-4 py-2 text-[13px] font-medium text-white transition-colors ${imagesFull ? "cursor-not-allowed opacity-50" : "hover:bg-[#f97316]"}`}>
              <ImagePlus size={18} className="text-white" />
              Upload images
            </button>
            {previewUrls.length > 0 && (
              <div className="relative w-full overflow-hidden rounded-[12px] bg-[#f8fafc]">
                <img src={previewUrls[Math.min(currentIdx, previewUrls.length - 1)]} alt={`Preview ${Math.min(currentIdx, previewUrls.length - 1) + 1} of ${previewUrls.length}`} className="h-[200px] w-full object-cover" />
                <button type="button" onClick={() => removeImage(currentIdx)} aria-label="Remove this image" className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]">
                  <X size={14} className="text-[#f97316]" />
                </button>
                {previewUrls.length > 1 && (
                  <>
                    <button type="button" onClick={showPreviousImage} aria-label="Previous image" className="absolute top-1/2 left-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0f172a] shadow-sm hover:bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]">
                      <ChevronLeft size={18} />
                    </button>
                    <button type="button" onClick={showNextImage} aria-label="Next image" className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0f172a] shadow-sm hover:bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]">
                      <ChevronRight size={18} />
                    </button>
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white">
                      {currentIdx + 1} / {previewUrls.length}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Clears the fixed action bar so the last card is fully scrollable into view */}
        <div aria-hidden className="h-[88px]" />

        <div className="fixed bottom-0 left-1/2 z-30 -translate-x-1/2 border-t border-[#e2e8f0] bg-white/95 px-[24px] py-[12px] backdrop-blur flex items-center justify-between gap-3 w-full max-w-[412px]">
          <Button onClick={() => {
            if (!(name.trim() && building.trim() && imageItems.length > 0)) {
              toast.error("Enter required data");
              return;
            }
            setLocationPreview({
              name: name.trim(),
              building: building.trim(),
              faculty: faculty.trim() || undefined,
              department: department.trim() || undefined,
              description: description.trim() || undefined,
              staffMonitored,
              amenities,
              hours: hoursString,
              imageItems: imageItems.map((item) => ({ url: item.url, file: item.file })),
              openTimeMode,
              peakEnabled,
              peakStart,
              peakEnd,
              isEditing: true,
              locationId: location!.id,
            });
            router.push("/university-admin/locations/preview");
          }} variant="default" className="flex-1 px-[16px] py-[20px] text-[14px] font-medium shadow-[0px_6px_16px_rgba(249,115,22,0.25)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 disabled:opacity-100">
            <Eye size={18} className="text-white mr-2" />
            <span>Preview</span>
          </Button>
          <Button type="submit" variant="default" className="flex-1 px-[16px] py-[20px] text-[14px] font-medium shadow-[0px_6px_16px_rgba(249,115,22,0.25)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 disabled:opacity-100">
            <MapPinned size={18} className="text-white" />
            <span>Update location</span>
          </Button>
        </div>
      </form>
    </div>
  );
}