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

export interface SubmittedReview {
  rating: number;
  comment: string;
}

interface AddReviewDialogProps {
  spotName: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hide the built-in "+ Add Review" pill when the dialog is opened elsewhere. */
  showTrigger?: boolean;
  /** Receives the submitted rating and comment so the parent can render the new review. */
  onSubmit?: (review: SubmittedReview) => void;
}

export function AddReviewDialog({
  spotName,
  open,
  onOpenChange,
  showTrigger = true,
  onSubmit,
}: AddReviewDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [previewedRating, setPreviewedRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(false);
  const [ratingError, setRatingError] = useState(false);

  const ratingLabelId = useId();
  const commentId = useId();
  const commentErrorId = useId();
  const descriptionId = useId();

  const activeRating = previewedRating ?? rating;
  const isOpen = open ?? internalOpen;

  function resetDraft() {
    setRating(0);
    setPreviewedRating(null);
    setComment("");
    setCommentError(false);
    setRatingError(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (open === undefined) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
    if (!nextOpen) resetDraft();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedComment = comment.trim();
    if (!rating) {
      setRatingError(true);
      return;
    }

    if (!trimmedComment) {
      setCommentError(true);
      return;
    }

    onSubmit?.({ rating, comment: trimmedComment });
    toast.success(`Review submitted for ${spotName}`);
    handleOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
            Rate {spotName} and share a comment with other students.
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
                    onChange={() => {
                      setRating(value);
                      setRatingError(false);
                    }}
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
            {ratingError ? (
              <p role="alert" className="text-[12px] leading-4 text-red-600">
                Please select a star rating before submitting.
              </p>
            ) : null}
          </div>

          <div className="flex w-full flex-col items-start gap-[6px]">
            <label
              htmlFor={commentId}
              className="font-heading text-[13px] leading-4 font-medium text-[#334052]"
            >
              Comment
            </label>
            <textarea
              id={commentId}
              name="comment"
              value={comment}
              onChange={(event) => {
                setComment(event.target.value);
                if (commentError && event.target.value.trim()) setCommentError(false);
              }}
              placeholder="Share what others should know…"
              aria-invalid={commentError}
              aria-describedby={commentError ? commentErrorId : undefined}
              className={`h-[92px] w-full resize-none rounded-[10px] border bg-white px-[10px] py-[6px] font-body text-sm leading-5 text-[#0f172a] placeholder:text-[#64748b] focus-visible:border-[#f97316] focus-visible:ring-2 focus-visible:ring-[#f97316]/30 focus-visible:outline-none ${
                commentError ? "border-red-500" : "border-[#e5e5e5]"
              }`}
            />
            {commentError ? (
              <p id={commentErrorId} role="alert" className="text-[12px] leading-4 text-red-600">
                Please enter a comment before submitting.
              </p>
            ) : null}
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
