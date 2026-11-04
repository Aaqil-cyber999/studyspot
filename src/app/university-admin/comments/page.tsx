"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getUaComments } from "@/services/university-admin";

export default function UaCommentsPage() {
  const { data: comments = [] } = useQuery({ queryKey: ["ua", "comments"], queryFn: getUaComments });
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <div className="px-[24px] pb-[16px] pt-[64px]">
        <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Comments & Ratings</h1>
      </div>
      <div className="space-y-[12px] px-[24px] pb-[100px]">
        {comments.map((c) => (
          <div key={c.id} className="rounded-[16px] border border-[#e2e8f0] bg-white p-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-[#f59e0b]">
                {"★".repeat(Math.round(c.rating))}{"☆".repeat(5 - Math.round(c.rating))} {c.rating.toFixed(1)}
              </p>
              <button
                onClick={() => {
                  setSelected(c.id);
                  setOpen(true);
                }}
                className="text-[12px] font-medium text-[#f97316]"
              >
                Moderate
              </button>
            </div>
            <p className="mt-2 text-[14px] text-[#334155]">&ldquo;{c.text}&rdquo;</p>
            <p className="mt-2 text-[12px] text-[#64748b]">
              {c.locationName} · {c.createdAt}
            </p>
          </div>
        ))}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="w-[412px] rounded-t-[24px] bg-white p-[24px] shadow-[0px_-4px_24px_rgba(0,0,0,0.08)]">
            <h2 className="text-[18px] font-semibold text-[#0f172a]">Moderation</h2>
            <p className="mt-2 text-[14px] text-[#64748b]">
              Choose an action for this comment.
            </p>
            <div className="mt-[20px] space-y-[10px]">
              <button
                onClick={() => {
                  setOpen(false);
                  toast.success("Comment kept");
                }}
                className="w-full rounded-[16px] bg-[#f97316] py-[14px] text-[14px] font-medium text-white shadow-[0px_6px_16px_rgba(249,115,22,0.25)]"
              >
                Keep
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  toast.success("Comment removed");
                }}
                className="w-full rounded-[16px] border border-[#fecaca] bg-white py-[14px] text-[14px] font-medium text-[#dc2626]"
              >
                Remove
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-full py-[12px] text-[14px] text-[#64748b]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}