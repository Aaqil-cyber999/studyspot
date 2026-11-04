"use client";

import { useId, useState } from "react";
import { MessageSquarePlus, Plus, Send, X } from "lucide-react";
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

const STAR_VALUES = [1, 2, 3, 4, 5];

interface AddReviewDialogProps {
  spotName: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hide the built-in "+ Add Review" pill when the dialog is opened elsewhere. */
  showTrigger?: boolean;
}

export function AddReviewDialog({
  spotName,
  open,
  onOpenChange,
  showTrigger = true,
}: AddReviewDialogProps) {
  const [rating, setRating] = useState(4);
  const [previewedRating, setPreviewedRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const ratingLabelId = useId();
  const commentId = useId();
  const descriptionId = useId();

  const activeRating = previewedRating ?? rating;

  function resetDraft() {
    setRating(4);
    setPreviewedRating(null);
    setComment("");
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange?.(nextOpen);
    if (!nextOpen) resetDraft();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.success(`Review submitted for ${spotName}`);
    onOpenChange?.(false);
    resetDraft();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {showTrigger ? (
        <DialogTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              className="h-auto shrink-0 gap-1 rounded-full bg-[#ffdbca] px-3 py-1.5 text-[11px] font-bold leading-[14px] tracking-[0.33px] text-[#341100] hover:bg-[#ffd0ba] focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
            />
          }
        >
          <Plus aria-hidden="true" className="size-3.5 text-[#341100]" strokeWidth={2} />
          Add Review
        </DialogTrigger>
      ) : null}

      <DialogContent
        className="w-[340px] max-w-[calc(100vw-1rem)] gap-4 border border-[#e2e8f0] p-5"
        aria-describedby={descriptionId}
      >
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <MessageSquarePlus
                aria-hidden="true"
                className="size-[18px] shrink-0 text-[#f97316]"
                strokeWidth={2}
              />
              <DialogTitle className="font-heading text-[17px] leading-6 font-semibold text-[#0f172a]">
                Add review
              </DialogTitle>
            </div>

            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label="Close dialog"
                  className="size-[26px] shrink-0 rounded-[8px] border-[#e2e8f0] bg-white p-1 text-[#0f172a] hover:bg-[#f8fafc] focus-visible:ring-2 focus-visible:ring-[#f97316]"
                />
              }
            >
              <X aria-hidden="true" className="size-4" strokeWidth={2} />
            </DialogClose>
          </div>

          <DialogDescription id={descriptionId} className="sr-only">
            Rate {spotName} and share an optional comment with other students.
          </DialogDescription>

          <div className="flex w-full flex-col items-start gap-[10px]">
            <p id={ratingLabelId} className="font-heading text-[13px] leading-4 font-medium text-[#334052]">
              Your rating
            </p>
            <div
              role="radiogroup"
              aria-labelledby={ratingLabelId}
              className="flex items-start gap-2"
              onMouseLeave={() => setPreviewedRating(null)}
            >
              {STAR_VALUES.map((value) => (
                <label
                  key={value}
                  onMouseEnter={() => setPreviewedRating(value)}
                  className="relative flex cursor-pointer rounded-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#f97316]"
                >
                  <input
                    type="radio"
                    name="rating"
                    value={value}
                    checked={rating === value}
                    onChange={() => setRating(value)}
                    className="sr-only"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    src={value <= activeRating ? "/assets/review/star-filled.svg" : "/assets/review/star-empty.svg"}
                    className="size-6 max-w-none"
                  />
                  <span className="sr-only">
                    {value} star{value === 1 ? "" : "s"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-[6px]">
            <label
              htmlFor={commentId}
              className="font-heading text-[13px] leading-4 font-medium text-[#334052]"
            >
              Comment (optional)
            </label>
            <textarea
              id={commentId}
              name="comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Share what others should know…"
              className="h-[92px] w-full resize-none rounded-[10px] border border-[#e5e5e5] bg-white px-[10px] py-[6px] font-body text-sm leading-5 text-[#0f172a] placeholder:text-[#64748b] focus-visible:border-[#f97316] focus-visible:ring-2 focus-visible:ring-[#f97316]/30 focus-visible:outline-none"
            />
          </div>

          <div className="flex w-full items-start gap-3">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-[52px] min-w-0 flex-1 gap-2.5 rounded-[12px] border-[#e2e8f0] bg-[#ddd] px-5 py-3 font-heading text-[15px] font-semibold tracking-[0.3px] text-[#334052] hover:bg-[#d4d4d4]"
                />
              }
            >
              <X aria-hidden="true" className="size-[18px]" strokeWidth={2} />
              Cancel
            </DialogClose>

            <Button
              type="submit"
              className="h-[52px] min-w-0 flex-1 gap-2.5 rounded-[12px] bg-[#f97316] px-5 py-3 font-heading text-[15px] font-semibold tracking-[0.3px] text-white shadow-[0px_6px_16px_0px_rgba(249,115,22,0.25)] hover:bg-[#ea6a0c]"
            >
              <Send aria-hidden="true" className="size-[18px]" strokeWidth={2} />
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
