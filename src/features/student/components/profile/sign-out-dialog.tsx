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
            className="flex h-[39px] w-full cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border border-[#e5e5e5] bg-[#ddd] px-[10px] py-[6px] text-[14px] leading-[20px] font-medium text-black transition-colors hover:bg-[#d4d4d4] focus-visible:ring-2 focus-visible:ring-[#f97316]/60 focus-visible:ring-offset-2 focus-visible:outline-none"
          />
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="size-[16px] max-w-none" src="/assets/profile/a7c4a.svg" />
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

          <DialogClose
            onClick={() => {
              toast.success("Signed out");
              router.push("/student/login");
            }}
            render={
              <Button
                type="button"
                className="h-[52px] min-w-0 flex-1 gap-2.5 rounded-[12px] bg-[#f97316] px-[22px] py-[14px] font-heading text-[15px] font-semibold tracking-[0.3px] text-white shadow-[0px_6px_16px_0px_rgba(249,115,22,0.25)] hover:bg-[#ea6a0c]"
              />
            }
          >
            <LogOut aria-hidden="true" className="size-[18px]" strokeWidth={2} />
            Sign out
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
