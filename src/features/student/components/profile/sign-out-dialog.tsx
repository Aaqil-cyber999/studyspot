"use client";

import { useId } from "react";
import { useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
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

export function SignOutDialog() {
  const router = useRouter();
  const descriptionId = useId();

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className="flex h-[39px] w-full cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border border-[#e5e5e5] bg-white px-[10px] py-[6px] text-[14px] leading-[20px] font-medium text-black transition-colors hover:bg-[#d4d4d4] focus-visible:ring-2 focus-visible:ring-[#f97316]/60 focus-visible:ring-offset-2 focus-visible:outline-none"
          />
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="student-invert size-[16px] max-w-none" src="/assets/profile/a7c4a.svg" />
        Sign out
      </DialogTrigger>

      <DialogContent
        className="w-[340px] max-w-[calc(100vw-2rem)] gap-4 rounded-[16px] border border-[#e2e8f0] p-5"
        aria-describedby={descriptionId}
      >
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <LogOut
              aria-hidden="true"
              className="size-[18px] shrink-0 text-[#f97316]"
              strokeWidth={1.5}
            />
            <DialogTitle className="font-heading text-[17px] leading-6 font-semibold text-[#0f172a]">
              Sign out
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

        <DialogDescription
          id={descriptionId}
          className="font-body text-[13px] leading-[18px] text-[#64748b]"
        >
          Are you sure you want to sign out? You can sign back in anytime.
        </DialogDescription>

        <div className="flex w-full items-center gap-2">
          <DialogClose
            render={
              <Button
                type="button"
                className="min-h-10 min-w-0 flex-1 rounded-xl bg-slate-200 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-300 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              />
            }
          >
            Cancel
          </DialogClose>

          <DialogClose
            onClick={() => {
              toast.success("Signed out");
              router.push("/student/login");
            }}
            render={
              <Button
                type="button"
                className="min-h-10 min-w-0 flex-1 rounded-xl bg-orange-500 px-4 text-sm font-semibold text-white hover:bg-orange-600 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              />
            }
          >
            Sign out
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
