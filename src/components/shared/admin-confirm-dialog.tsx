"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  destructive = false,
  onOpenChange,
  onConfirm,
}: AdminConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 p-5">
        <div className="space-y-2">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="min-h-10 flex-1 rounded-xl bg-slate-200 px-4 text-sm font-semibold text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`min-h-10 flex-1 rounded-xl px-4 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
              destructive ? "bg-red-600" : "bg-orange-500"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
