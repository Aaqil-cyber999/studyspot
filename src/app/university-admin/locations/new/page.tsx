"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useLocationPreviewStore } from "@/stores/location-preview-store";
import { ImagePlus, X, LayoutGrid, Check, Plus, TrendingUp, UserCheck, Clock, MapPinned, Eye, Images } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { ImageCarousel } from "@/components/shared/image-carousel";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { TimePicker, formatTimeLabel } from "@/components/ui/time-picker";
import toast from "react-hot-toast";
import { z } from "zod";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";

import { createUaLocation } from "@/services/university-admin";

const schema = z.object({
  name: z.string().min(2, "Enter a location name"),
  building: z.string().min(2, "Enter a building"),
});

type OpenTimeMode = "always" | "custom";

const MAX_IMAGES = 5;

const AMENITY_OPTIONS = ["Wi-Fi", "Power outlets", "Computers", "Printer", "Cafeteria", "Parking", "Elevator", "Accessible seating", "Quiet zone", "Group tables"];

const DEFAULT_AMENITIES = ["Wi-Fi", "Power outlets"];

export default function AddLocationPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [building, setBuilding] = useState("");
  const [faculty, setFaculty] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [staffMonitored, setStaffMonitored] = useState(false);
  const [amenities, setAmenities] = useState<string[]>(() => [...DEFAULT_AMENITIES]);
  const [amenityOptions, setAmenityOptions] = useState<string[]>(() => [...AMENITY_OPTIONS]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [customAmenityOpen, setCustomAmenityOpen] = useState(false);
  const customAmenityInputRef = useRef<HTMLInputElement>(null);
  const customAmenityTriggerRef = useRef<HTMLButtonElement>(null);
  const customAmenityTouchedRef = useRef(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const setLocationPreview = useLocationPreviewStore((state) => state.setData);
  const queryClient = useQueryClient();
  const [currentIdx, setCurrentIdx] = useState(0);

  // Opening hours state (24-hour "HH:mm", rendered as a 12-hour label)
  const [openTimeMode, setOpenTimeMode] = useState<OpenTimeMode>("custom");
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("22:00");

  // Peak hours state
  const [peakEnabled, setPeakEnabled] = useState(false);
  const [peakStart, setPeakStart] = useState("12:00");
  const [peakEnd, setPeakEnd] = useState("14:00");

  const isAlwaysOpen = openTimeMode === "always";

  const hoursString = isAlwaysOpen ? "24/7" : `${formatTimeLabel(openTime)} – ${formatTimeLabel(closeTime)}`;

  const imagesFull = images.length >= MAX_IMAGES;

  const wifiAvailable = amenities.includes("Wi-Fi");

  function toggleAmenity(amenity: string) {
    setAmenities((prev) => (prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity]));
  }

  function addCustomAmenity() {
    const value = customAmenity.trim().replace(/\s+/g, " ");
    if (!value) return;
    const existing = amenityOptions.find((item) => item.toLowerCase() === value.toLowerCase());
    const amenity = existing ?? value;
    if (!existing) {
      setAmenityOptions((prev) => [...prev, value]);
      toast.success(`"${value}" added to amenities`);
    }
    setAmenities((prev) => (prev.includes(amenity) ? prev : [...prev, amenity]));
    setCustomAmenity("");
    setCustomAmenityOpen(false);
  }

  function cancelCustomAmenity() {
    setCustomAmenity("");
    setCustomAmenityOpen(false);
  }

  // Keep focus with the custom-amenity row: in the input while typing, back on
  // the trigger once the row closes. Skips the initial mount so the page does
  // not steal focus (or scroll) on load.
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

  // Rebuild object URLs when the file list changes; revoke the old ones on cleanup.
  const previewUrls = useMemo(() => images.map((file) => URL.createObjectURL(file)), [images]);
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = schema.safeParse({ name, building });
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid";
      toast.error(message);
      return;
    }
    if (images.length === 0) {
      toast.error("Upload at least one image");
      return;
    }
    setConfirmOpen(true);
  }

  async function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 800;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = width * ratio;
          height = height * ratio;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
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
          mime,
          0.7,
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }

  async function confirmAdd() {
    const compressed: string[] = [];
    for (const file of images) {
      try {
        const dataUrl = await compressImage(file);
        compressed.push(dataUrl);
      } catch (e) {
        console.error("Image compression error", e);
      }
    }
    const imageUrls = compressed;

    try {
      await createUaLocation({
        name: name.trim(),
        building: building.trim(),
        faculty: faculty.trim() || undefined,
        department: department.trim() || undefined,
        staffMonitored,
        address: building.trim(),
        hours: hoursString,
        status: "Active",
        seats: "Limited",
        wifi: wifiAvailable ? "Medium" : "Weak",
        crowd: "Medium",
        noise: "Moderate",
        description: description.trim() || `A student study space in the ${building.trim()} building.`,
        amenities,
        imageUrls,
      });
      toast.success("Location added");
      await queryClient.invalidateQueries({ queryKey: ["ua", "locations"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add the location.");
      return;
    }

    router.push("/university-admin/locations");
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const remaining = Math.max(MAX_IMAGES - images.length, 0);
    const selected = Array.from(files).slice(0, remaining);
    if (files.length > remaining) {
      toast.error(`You can upload up to ${MAX_IMAGES} images`);
    }
    setImages((prev) => [...prev, ...selected]);
    setCurrentIdx(0);
    // Reset so picking the same file again still fires onChange.
    e.target.value = "";
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setCurrentIdx(0);
  }

  function showPreviousImage() {
    setCurrentIdx((idx) => (idx - 1 + previewUrls.length) % previewUrls.length);
  }

  function showNextImage() {
    setCurrentIdx((idx) => (idx + 1) % previewUrls.length);
  }

  return (
    <div className="min-h-screen bg-[#E2E8F0]">
      <div className="flex items-center gap-3 px-[24px] pb-[16px] pt-[16px]">
        <button onClick={() => router.back()} className="flex size-9 items-center justify-center rounded-full border border-[#e2e8f0] bg-white">
          <ArrowLeft className="size-5 text-[#0f172a]" />
        </button>
        <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Add location</h1>
      </div>
      <form onSubmit={submit} className="px-[24px]">
        <div className="space-y-[12px] rounded-[20px] border border-[#e2e8f0] bg-white p-[20px] shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#334155]">
              Location name <span className="text-red-500">*</span>
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Central Library Study Zone" className="w-full rounded-[14px] border border-[#e2e8f0] px-[16px] py-[12px] text-[14px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]" />
          </div>
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#334155]">
              Building <span className="text-red-500">*</span>
            </label>
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
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., A quiet study space with natural lighting and comfortable seating" rows={3} className="w-full resize-none rounded-[14px] border border-[#e2e8f0] px-[16px] py-[12px] text-[14px] text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus-visible:border-[#f97316] focus-visible:ring-2 focus-visible:ring-[#f97316]/40" />
          </div>

          {/* Staff monitored */}
          <div className="flex items-center justify-between rounded-[14px] border border-[#e2e8f0] px-[16px] py-[12px]">
            <div className="flex items-center gap-2">
              <UserCheck size={16} className="text-[#0f172a]" />
              <span id="staff-monitored-label" className="text-[13px] font-medium text-[#334155]">
                Staff monitored
              </span>
            </div>
            <Switch aria-labelledby="staff-monitored-label" checked={staffMonitored} onCheckedChange={setStaffMonitored} />
          </div>

          {/* Opening hours */}
          <div className="rounded-[14px] border border-[#e2e8f0] p-[14px] space-y-[12px]">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-[#0f172a]" />
              <span className="text-[13px] font-medium text-[#334155]">
                Opening hours <span className="text-red-500">*</span>
              </span>
            </div>

            {/* Always open toggle */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#64748b]">Always open (24/7)</span>
              <Switch checked={isAlwaysOpen} onCheckedChange={(val) => setOpenTimeMode(val ? "always" : "custom")} />
            </div>

            {/* Custom time range */}
            <div className={`space-y-[10px] transition-opacity ${isAlwaysOpen ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
              <div className="flex items-end gap-3">
                <div>
                  <label htmlFor="open-time" className="mb-1 block text-[12px] text-[#94a3b8]">
                    Open time
                  </label>
                  <TimePicker id="open-time" aria-label="Open time" value={openTime} onChange={setOpenTime} disabled={isAlwaysOpen} />
                </div>
                <div>
                  <label htmlFor="close-time" className="mb-1 block text-[12px] text-[#94a3b8]">
                    Close time
                  </label>
                  <TimePicker id="close-time" aria-label="Close time" value={closeTime} onChange={setCloseTime} disabled={isAlwaysOpen} />
                </div>
              </div>
            </div>

            <p className="text-[12px] text-[#94a3b8]">
              Open: <span className="text-[#f97316] font-medium">{hoursString}</span>
            </p>

            {/* Divider */}
            <div className="border-t border-[#e2e8f0]" />

            {/* Peak hours */}
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
                      <label htmlFor="peak-start" className="mb-1 block text-[12px] text-[#94a3b8]">
                        Peak start
                      </label>
                      <TimePicker id="peak-start" aria-label="Peak start" value={peakStart} onChange={setPeakStart} />
                    </div>
                    <div>
                      <label htmlFor="peak-end" className="mb-1 block text-[12px] text-[#94a3b8]">
                        Peak end
                      </label>
                      <TimePicker id="peak-end" aria-label="Peak end" value={peakEnd} onChange={setPeakEnd} />
                    </div>
                  </div>
                  <p className="text-[12px] text-[#94a3b8]">
                    Peak:{" "}
                    <span className="text-[#f97316] font-medium">
                      {formatTimeLabel(peakStart)} – {formatTimeLabel(peakEnd)}
                    </span>
                  </p>
                </div>
              )}
            </div>
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
              {[...amenityOptions]
                .sort((a, b) => {
                  const aSelected = amenities.includes(a);
                  const bSelected = amenities.includes(b);
                  if (aSelected && !bSelected) return -1;
                  if (!aSelected && bSelected) return 1;
                  return 0;
                })
                .map((amenity) => {
                  const selected = amenities.includes(amenity);
                  return (
                    <button key={amenity} type="button" aria-pressed={selected} onClick={() => toggleAmenity(amenity)} className={`flex items-center gap-[6px] rounded-full border px-[12px] py-[6px] text-[12px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] ${selected ? "border-[#fa8c16] bg-[#fa8c16] text-white" : "border-[#e2e8f0] bg-white text-[#334155] hover:bg-[#f8fafc]"}`}>
                      {selected && <Check size={12} className="text-white" />}
                      {amenity}
                    </button>
                  );
                })}
            </div>

            {customAmenityOpen ? (
              <div className="flex items-center gap-[8px]">
                <input
                  ref={customAmenityInputRef}
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomAmenity();
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      cancelCustomAmenity();
                    }
                  }}
                  maxLength={30}
                  placeholder="e.g., Whiteboards"
                  aria-label="Custom amenity name"
                  className="min-w-0 flex-1 rounded-[12px] border border-[#e2e8f0] bg-white px-[12px] py-[7px] text-[13px] text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus-visible:border-[#f97316] focus-visible:ring-2 focus-visible:ring-[#f97316]/40"
                />
                <button type="button" onClick={addCustomAmenity} disabled={!customAmenity.trim()} className={`shrink-0 rounded-[12px] px-[12px] py-[7px] text-[12px] font-medium text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] ${customAmenity.trim() ? "bg-[#f97316] hover:bg-[#ea580c]" : "cursor-not-allowed bg-[#f97316]/50"}`}>
                  Add
                </button>
                <button type="button" onClick={cancelCustomAmenity} aria-label="Cancel adding a custom amenity" className="flex size-[30px] shrink-0 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#334155] outline-none hover:bg-[#f8fafc] focus-visible:ring-2 focus-visible:ring-[#f97316]">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button ref={customAmenityTriggerRef} type="button" onClick={() => setCustomAmenityOpen(true)} className="flex w-full items-center justify-center gap-[6px] rounded-[12px] border border-dashed border-[#e2e8f0] bg-white py-[8px] text-[12px] font-medium text-[#f97316] outline-none transition-colors hover:border-[#f97316] hover:bg-[#fff7ed] focus-visible:ring-2 focus-visible:ring-[#f97316]">
                <Plus size={14} />
                Add a custom amenity
              </button>
            )}
          </div>

          {/* Images */}
          <div className="space-y-[12px] rounded-[14px] border border-[#e2e8f0] p-[14px]">
            <label htmlFor="image-input" className="flex items-center gap-2">
              <Images size={16} className="text-[#0f172a]" />
              <span className="text-[13px] font-medium text-[#334155]">
                Images <span className="text-red-500">*</span>
              </span>
              <span className="text-[12px] text-[#94a3b8]">
                {images.length}/{MAX_IMAGES} · JPG/PNG
              </span>
            </label>
            <input id="image-input" type="file" accept="image/jpeg,image/png" multiple onChange={handleImageChange} className="hidden" />
            <button type="button" onClick={() => document.getElementById("image-input")?.click()} disabled={imagesFull} className={`flex items-center gap-2 rounded-[16px] bg-[#fa8c16] px-4 py-2 text-[13px] font-medium text-white transition-colors ${imagesFull ? "cursor-not-allowed opacity-50" : "hover:bg-[#f97316]"}`}>
              <ImagePlus size={18} className="text-white" />
              Upload images
            </button>

            <ImageCarousel previewUrls={previewUrls} currentIdx={currentIdx} onRemove={removeImage} onPrev={showPreviousImage} onNext={showNextImage} showRemoveButton={true} />
          </div>
        </div>

        {/* Clears the fixed action bar so the last card is fully scrollable into view */}
        <div aria-hidden className="h-[88px]" />

        <div className="fixed bottom-0 left-1/2 z-30 -translate-x-1/2 border-t border-[#e2e8f0] bg-white/95 px-[24px] py-[12px] backdrop-blur flex items-center justify-between gap-3 w-full max-w-[412px]">
          {/* Preview button - enabled only when name and building are filled */}

          <Button
            onClick={() => {
              if (!(name.trim() && building.trim() && images.length > 0)) {
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
                imageItems: images.map((file) => ({ url: URL.createObjectURL(file), file })),
                openTimeMode,
                peakEnabled,
                peakStart,
                peakEnd,
              });
              router.push("/university-admin/locations/preview");
            }}
            variant="default"
            className="flex-1 px-[16px] py-[20px] text-[14px] font-medium shadow-[0px_6px_16px_rgba(249,115,22,0.25)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 disabled:opacity-100">
            <Eye size={18} className="text-white mr-2" />
            <span>Preview</span>
          </Button>

          <Button type="submit" variant="default" className="flex-1 px-[16px] py-[20px] text-[14px] font-medium shadow-[0px_6px_16px_rgba(249,115,22,0.25)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 disabled:opacity-100">
            <MapPinned className="size-[18px] text-white" />
            <span>Create location</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
