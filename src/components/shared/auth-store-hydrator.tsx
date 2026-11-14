"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

// Rehydrates the persisted auth role from localStorage once the app has
// mounted, so server and first-client renders agree before any route guard
// runs. Rendered once from the root layout.
export function AuthStoreHydrator() {
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
  }, []);

  return null;
}
