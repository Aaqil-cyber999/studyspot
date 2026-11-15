"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MapPinned, Check, LayoutGrid, UserCheck, Clock, Images, ChevronLeft, ChevronRight, Building2, GraduationCap, BookOpen, Pencil, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTimeLabel } from "@/components/ui/time-picker";
import { useLocationPreviewStore } from "@/stores/location-preview-store";
import { useUniversityAdminStore } from "@/stores/university-admin-store";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

export default function LocationPreviewPage() {
  const router = useRouter();
  const previewData = useLocationPreviewStore((state) => state.data);
  const clearPreview = useLocationPreviewStore((state) => state.clearData);
  const addLocation = useUniversityAdminStore((state) => state.addLocation);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!previewData) {
      router.replace("/university-admin/locations/new");
      return;
    }
    setPreviewUrls(previewData.imageItems.map((item) => item.url));
  }, [previewData, router]);

  if (!previewData) {
    return null;
  }

  const {
    name,
    building,
    faculty,
    department,
    description,
    staffMonitored,
    amenities,
    hours,
    imageItems,
    openTimeMode,
    peakEnabled,
    peakStart,
    peakEnd,
  } = previewData;

  const isAlwaysOpen = openTimeMode === "always";

  async function handleCreateLocation() {
    const compressed: string[] = [];
    for (const item of previewData!.imageItems) {
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
    const mockImage = (await import("@/mocks/data/study-spots")).studySpotCatalog[
      (name.trim().length + building.trim().length) % (await import("@/mocks/data/study-spots")).studySpotCatalog.length
    ]?.imageUrls[0];
    const imageUrls = compressed.length > 0 ? compressed : mockImage ? [mockImage] : [];

    if (previewData!.isEditing && previewData!.locationId) {
      const updateLocation = useUniversityAdminStore.getState().updateLocation;
      updateLocation(previewData!.locationId, {
        name: name.trim(),
        building: building.trim(),
        faculty: faculty?.trim() || undefined,
        department: department?.trim() || undefined,
        staffMonitored,
        area: building.trim(),
        hours,
        status: "Active",
        seats: "Unsure",
        wifi: amenities.includes("Wi-Fi") ? "Medium" : "Weak",
        crowd: "Medium",
        noise: "Moderate",
        description: description?.trim() || `A student study space in the ${building.trim()} building.`,
        category: "Study space",
        amenities,
        imageUrls,
      });
      clearPreview();
      toast.success("Location updated");
      router.push(`/university-admin/locations/${previewData!.locationId}`);
    } else {
      addLocation({
        name: name.trim(),
        building: building.trim(),
        faculty: faculty?.trim() || undefined,
        department: department?.trim() || undefined,
        staffMonitored,
        area: building.trim(),
        hours,
        status: "Active",
        seats: "Unsure",
        wifi: amenities.includes("Wi-Fi") ? "Medium" : "Weak",
        crowd: "Medium",
        noise: "Moderate",
        description: description?.trim() || `A student study space in the ${building.trim()} building.`,
        category: "Study space",
        amenities,
        imageUrls,
      });
      clearPreview();
      toast.success("Location created");
      router.push("/university-admin/locations");
    }
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

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 bg-[#fbfbfc] px-[24px] pb-[16px] pt-[16px]">
        <button
          onClick={() => router.back()}
          className="flex size-9 items-center justify-center rounded-full border border-[#e2e8f0] bg-white"
        >
          <ArrowLeft className="size-5 text-[#0f172a]" />
        </button>
        <h1 className="flex-1 text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Preview location</h1>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 rounded-[12px] bg-[#f97316] px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
        >
          <Pencil className="size-4 text-white" />
          Edit
        </button>
      </div>

      <div className="px-[24px] space-y-[16px]">
        {/* Location info card */}
        <div className="rounded-[20px] border border-[#e2e8f0] bg-white p-[20px] shadow-[0px_4px_16px_rgba(0,0,0,0.04)] space-y-[16px]">
          {/* Header with name */}
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#f1f5f9]">
              <MapPinned className="size-4 text-[#64748b]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] text-[#94a3b8] mb-0.5">Location name</p>
              <p className="text-[14px] font-medium text-[#0f172a] truncate">{name}</p>
            </div>
          </div>

          {/* Building */}
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#f1f5f9]">
              <Building2 className="size-4 text-[#64748b]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] text-[#94a3b8] mb-0.5">Building</p>
              <p className="text-[14px] text-[#0f172a] truncate">{building}</p>
            </div>
          </div>

          {/* Faculty */}
          {faculty && (
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#f1f5f9]">
                <GraduationCap className="size-4 text-[#64748b]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] text-[#94a3b8] mb-0.5">Faculty</p>
                <p className="text-[14px] text-[#0f172a] truncate">{faculty}</p>
              </div>
            </div>
          )}

          {/* Department */}
          {department && (
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#f1f5f9]">
                <BookOpen className="size-4 text-[#64748b]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] text-[#94a3b8] mb-0.5">Department</p>
                <p className="text-[14px] text-[#0f172a] truncate">{department}</p>
              </div>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#f1f5f9]">
                <FileText className="size-4 text-[#64748b]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] text-[#94a3b8] mb-0.5">Description</p>
                <p className="text-[14px] text-[#0f172a]">{description}</p>
              </div>
            </div>
          )}

          {/* Staff monitored */}
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#f1f5f9]">
              <UserCheck className="size-4 text-[#64748b]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] text-[#94a3b8] mb-0.5">Staff monitored</p>
              <p className="text-[14px] text-[#0f172a]">{staffMonitored ? "Yes" : "No"}</p>
            </div>
            {staffMonitored && (
              <span className="shrink-0 rounded-full bg-[#dcfce7] px-2.5 py-1 text-[11px] font-medium text-[#16a34a]">Active</span>
            )}
          </div>
        </div>

        {/* Opening hours card */}
        <div className="rounded-[20px] border border-[#e2e8f0] bg-white p-[20px] shadow-[0px_4px_16px_rgba(0,0,0,0.04)] space-y-[12px]">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-[#0f172a]" />
            <span className="text-[13px] font-medium text-[#334155]">Opening hours</span>
          </div>
          <p className="text-[14px] text-[#0f172a]">
            {isAlwaysOpen ? "24/7 (Always open)" : hours}
          </p>
          {peakEnabled && (
            <p className="text-[12px] text-[#94a3b8]">
              Peak:{" "}
              <span className="text-[#f97316] font-medium">
                {formatTimeLabel(peakStart)} – {formatTimeLabel(peakEnd)}
              </span>
            </p>
          )}
        </div>

        {/* Amenities card */}
        <div className="rounded-[20px] border border-[#e2e8f0] bg-white p-[20px] shadow-[0px_4px_16px_rgba(0,0,0,0.04)] space-y-[12px]">
          <div className="flex items-center gap-2">
            <LayoutGrid className="size-4 text-[#0f172a]" />
            <span className="text-[13px] font-medium text-[#334155]">Amenities</span>
            <span className="text-[12px] text-[#94a3b8]">{amenities.length} selected</span>
          </div>
          <div className="flex flex-wrap gap-[8px]">
            {amenities.map((amenity) => (
              <span
                key={amenity}
                className="flex items-center gap-[6px] rounded-full border border-[#fa8c16] bg-[#fa8c16] px-[12px] py-[6px] text-[12px] font-medium text-white"
              >
                <Check className="size-3 text-white" />
                {amenity}
              </span>
            ))}
            {amenities.length === 0 && (
              <p className="text-[13px] text-[#94a3b8]">No amenities selected</p>
            )}
          </div>
        </div>

        {/* Images card */}
        <div className="rounded-[20px] border border-[#e2e8f0] bg-white p-[20px] shadow-[0px_4px_16px_rgba(0,0,0,0.04)] space-y-[12px]">
          <div className="flex items-center gap-2">
            <Images className="size-4 text-[#0f172a]" />
            <span className="text-[13px] font-medium text-[#334155]">Images</span>
            <span className="text-[12px] text-[#94a3b8]">{imageItems.length} uploaded</span>
          </div>
          {previewUrls.length > 0 && (
            <div className="relative w-full overflow-hidden rounded-[12px] bg-[#f8fafc]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrls[Math.min(currentIdx, previewUrls.length - 1)]}
                alt={`Preview ${Math.min(currentIdx, previewUrls.length - 1) + 1} of ${previewUrls.length}`}
                className="h-[200px] w-full object-cover"
              />
              {previewUrls.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((idx) => (idx - 1 + previewUrls.length) % previewUrls.length)}
                    aria-label="Previous image"
                    className="absolute top-1/2 left-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0f172a] shadow-sm hover:bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
                  >
                    <ChevronLeft className="size-[18px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((idx) => (idx + 1) % previewUrls.length)}
                    aria-label="Next image"
                    className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0f172a] shadow-sm hover:bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
                  >
                    <ChevronRight className="size-[18px]" />
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


      {/* Spacer for fixed button */}
      <div aria-hidden className="h-[100px]" />

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-1/2 z-30 -translate-x-1/2 border-t border-[#e2e8f0] bg-white/95 px-[24px] py-[12px] backdrop-blur w-full max-w-[412px]">
        <Button
          type="button"
          onClick={handleCreateLocation}
          variant="default"
          className="w-full px-[16px] py-[20px] text-[14px] font-medium shadow-[0px_6px_16px_rgba(249,115,22,0.25)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
        >
          <MapPinned className="size-[18px] text-white" />
          <span>Create location</span>
        </Button>
      </div>
    </div>
  );
}
