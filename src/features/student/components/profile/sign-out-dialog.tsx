"use client";

import { useId, useState } from "react";
import { LogOut, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { logout } from "@/services/auth";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SignOutDialog() {
  const descriptionId = useId();
  const [signingOut, setSigningOut] = useState(false);
  const signOut = useAuthStore((state) => state.signOut);

  async function doSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    let revoked = true;
    try {
      revoked = await logout();
    } catch {
      // Sign out locally even if the server cookie could not be revoked.
      revoked = false;
    } finally {
      signOut();
      toast.success(revoked ? "Signed out" : "Signed out on this device (server session could not be revoked)");
      // Full document load: never reuse a cached client page or stale RSC
      // payload after the session is gone.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/");
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className="flex h-[39px] w-full cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border border-slate-300 bg-slate-300 px-[10px] py-[6px] text-[14px] leading-[20px] font-medium text-black transition-colors hover:bg-slate-400 focus-visible:ring-2 focus-visible:ring-[#f97316]/60 focus-visible:ring-offset-2 focus-visible:outline-none"
          />
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="student-invert size-[16px] max-w-none" src="/assets/profile/a7c4a.svg" />
        Sign out
      </DialogTrigger>

      <DialogContent
        className="w-[90vw] md:w-[340px] gap-4 rounded-[16px] border border-[#e2e8f0] p-5"
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
            onClick={doSignOut}
            disabled={signingOut}
            render={
              <Button
                type="button"
                disabled={signingOut}
                className="min-h-10 min-w-0 flex-1 rounded-xl bg-orange-500 px-4 text-sm font-semibold text-white hover:bg-orange-600 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-60"
              />
            }
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
