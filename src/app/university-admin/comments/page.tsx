"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getUaComments, moderateUaComment } from "@/services/university-admin";
import { AdminPageHeader } from "@/components/navigation/admin-page-header";

export default function UaCommentsPage() {
  const query = useQuery({ queryKey: ["ua", "comments"], queryFn: getUaComments });
  const comments = query.data ?? [];
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white pb-[90px]">
      <AdminPageHeader title="Reviews & Ratings" subtitle="Keep feedback helpful for students" />
      <main className="space-y-[12px] px-[24px] pt-[4px]">
        {comments.map((c) => (
          <article key={c.id} className="rounded-[16px] border border-[#e2e8f0] bg-white p-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-orange-500">
                {"★".repeat(Math.round(c.rating))} {c.rating.toFixed(1)}
              </p>
              <button
                onClick={() => {
                  setSelected(c.id);
                  setOpen(true);
                }}
                aria-label={`Moderate review from ${c.author}`}
                className="rounded-full bg-[#ffdbca] px-[10px] py-[5px] text-[11px] font-medium text-[#c2410c] focus-visible:outline-2 focus-visible:outline-[#f97316]"
              >
                Moderate
              </button>
            </div>
            <p className="mt-[6px] text-[14px] text-[#334155]">&ldquo;{c.text}&rdquo;</p>
            <p className="mt-[6px] text-[12px] text-[#64748b]">
              {c.locationName} · {c.createdAt}
            </p>
          </article>
        ))}
      </main>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="w-[412px] rounded-t-[24px] bg-white p-[24px]">
            <h2 className="text-[20px] font-semibold text-[#0f172a]">Moderate review</h2>
            <p className="mt-[6px] text-[13px] text-[#64748b]">
              Choose whether to keep or remove review {selected}.
            </p>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  setOpen(false);
                  void moderateUaComment(selected ?? "", "keep").then(() => {
                    toast.success("Review kept");
                    void query.refetch();
                  });
                }}
                className="w-full rounded-[16px] bg-[#f97316] py-[14px] text-[15px] font-medium text-white"
              >
                Keep
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  void moderateUaComment(selected ?? "", "remove").then(() => {
                    toast.success("Review removed");
                    void query.refetch();
                  });
                }}
                className="w-full rounded-[16px] border border-[#fecaca] py-[14px] text-[15px] font-medium text-[#dc2626]"
              >
                Remove
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-full py-3 text-sm text-slate-500"
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