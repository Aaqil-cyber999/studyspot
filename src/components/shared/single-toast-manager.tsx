"use client";

import { useEffect } from "react";
import toast, { useToasterStore } from "react-hot-toast";

export function SingleToastManager() {
  const { toasts } = useToasterStore();

  useEffect(() => {
    const newestVisibleToast = toasts.find((currentToast) => !currentToast.dismissed);
    toasts
      .filter((currentToast) => currentToast.id !== newestVisibleToast?.id)
      .forEach(({ id }) => toast.remove(id));
  }, [toasts]);

  return null;
}
