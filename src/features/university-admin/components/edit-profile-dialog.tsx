"use client";

import { useId, useRef, useState } from "react";
import { ImagePlus, Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { editAdminProfileSchema } from "@/features/university-admin/schemas";
import { profileImageSchema } from "@/lib/profile-image";

interface EditProfileDialogProps {
  name: string;
  image: string | null;
  onSave: (values: { name: string; image: string | null }) => void;
  triggerLabel?: string;
  triggerClassName?: string;
  triggerTextClassName?: string;
}

/**
 * Admin profile editor, sharing the student "Edit info" modal shell: orange
 * pencil header, close button, photo + name fields and Cancel / Edit actions.
 */
export function EditProfileDialog({
  name,
  image,
  onSave,
  triggerLabel = "Edit profile",
  triggerClassName = "flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 text-xs font-semibold text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
  triggerTextClassName = "text-xs font-semibold",
}: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftImage, setDraftImage] = useState<string | null>(image);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const nameId = useId();
  const descriptionId = useId();
  const imageHintId = useId();
  const errorId = useId();

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) return;
    setDraftName(name);
    setDraftImage(image);
    setError(null);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Clear the input so picking the same file again still fires a change event.
    event.target.value = "";

    if (!file) return;

    const result = profileImageSchema.safeParse(file);

    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Choose a valid image";
      setError(message);
      toast.error(message);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        const message = "Could not read that image. Try another file.";
        setError(message);
        toast.error(message);
        return;
      }

      setDraftImage(reader.result);
      setError(null);
    };
    reader.onerror = () => {
      const message = "Could not read that image. Try another file.";
      setError(message);
      toast.error(message);
    };
    reader.readAsDataURL(result.data);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = editAdminProfileSchema.safeParse({ name: draftName });

    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Check the fields above";
      setError(message);
      toast.error(message);
      return;
    }

    onSave({ name: result.data.name, image: draftImage });
    setError(null);
    setOpen(false);
    toast.success("Profile changes saved");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={<button type="button" className={triggerClassName} />}
      >
        <Pencil aria-hidden="true" className="size-[14px]" strokeWidth={1.5} />
        <span className={triggerTextClassName}>{triggerLabel}</span>
      </DialogTrigger>

      <DialogContent
        className="w-[340px] max-w-[calc(100vw-2rem)] gap-4 rounded-[16px] border border-[#e2e8f0] p-5"
        aria-describedby={descriptionId}
      >
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4" noValidate>
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <Pencil
                aria-hidden="true"
                className="size-[18px] shrink-0 text-[#f97316]"
                strokeWidth={1.5}
              />
              <DialogTitle className="font-heading text-[17px] leading-6 font-semibold text-[#0f172a]">
                Edit info
              </DialogTitle>
            </div>

            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label="Close dialog"
                  className="size-[26px] shrink-0 rounded-[8px] border-[#e2e8f0] bg-white p-1 text-[#334155] hover:bg-[#f8fafc] focus-visible:ring-2 focus-visible:ring-[#f97316]"
                />
              }
            >
              <X aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </DialogClose>
          </div>

          <DialogDescription id={descriptionId} className="sr-only">
            Update the photo and name shown on your admin profile.
          </DialogDescription>

          <div className="flex w-full items-center gap-3">
            <ProfileAvatar
              name={draftName || name}
              imageUrl={draftImage}
              className="size-[48px]"
              textClassName="text-[16px]"
            />

            <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-describedby={imageHintId}
                  className="h-[32px] gap-[6px] rounded-[8px] bg-[#ffdbca] px-[10px] py-[6px] font-heading text-[12px] leading-4 font-medium text-[#c2410c] hover:bg-[#fed7aa] focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-1"
                >
                  <ImagePlus aria-hidden="true" className="size-[14px]" strokeWidth={2} />
                  {draftImage ? "Change photo" : "Upload photo"}
                </Button>

                {draftImage ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDraftImage(null);
                      setError(null);
                    }}
                    className="rounded-[8px] px-[6px] py-[6px] font-heading text-[12px] leading-4 font-medium text-[#64748b] transition-colors hover:text-[#dc2626] focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:outline-none"
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <p id={imageHintId} className="font-body text-[11px] leading-4 text-[#64748b]">
                PNG, JPG or WebP, up to 5 MB.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex w-full flex-col gap-[10px]">
            <label
              htmlFor={nameId}
              className="w-full font-heading text-[13px] leading-4 font-medium text-[#334052]"
            >
              Name
            </label>
            <input
              id={nameId}
              name="name"
              type="text"
              autoComplete="name"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className="w-full rounded-[12px] border border-[#e2e8f0] bg-white px-4 py-[14px] font-heading text-[15px] leading-[19px] font-normal text-black outline-none focus-visible:border-[#f97316] focus-visible:ring-2 focus-visible:ring-[#f97316]/30 aria-invalid:border-[#dc2626]"
            />
          </div>

          <p
            id={errorId}
            role="alert"
            className="font-body text-[11px] leading-4 text-[#dc2626] empty:hidden"
          >
            {error}
          </p>

          <div className="flex w-full items-start gap-3">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-[52px] min-w-0 flex-1 gap-2.5 rounded-[12px] border-[#e2e8f0] bg-[#ddd] px-[22px] py-[14px] font-heading text-[15px] font-semibold tracking-[0.3px] text-[#334052] hover:bg-[#d4d4d4]"
                />
              }
            >
              <X aria-hidden="true" className="size-[18px]" strokeWidth={2} />
              Cancel
            </DialogClose>

            <Button
              type="submit"
              className="h-[52px] min-w-0 flex-1 gap-2.5 rounded-[12px] bg-[#f97316] px-[22px] py-[14px] font-heading text-[15px] font-semibold tracking-[0.3px] text-white shadow-[0px_6px_16px_0px_rgba(249,115,22,0.25)] hover:bg-[#ea6a0c]"
            >
              <Pencil aria-hidden="true" className="size-[18px]" strokeWidth={2} />
              Edit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
