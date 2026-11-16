"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useProfileStore } from "@/stores/profile-store";
import { me } from "@/services/auth";

// Rehydrates the persisted auth role from localStorage once the app has
// mounted, so server and first-client renders agree before any route guard
// runs. It also verifies the session cookie against the backend: a missing
// or rejected session clears the stale role, while a network/server error
// leaves the role alone so the app still works when the API is unreachable.
// The student profile cache is hydrated from the same /auth/me response.
export function AuthStoreHydrator() {
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await useAuthStore.persist.rehydrate();
      const role = useAuthStore.getState().role;
      if (!role) return;

      try {
        const user = await me();
        if (cancelled) return;
        if (!user) {
          useAuthStore.getState().signOut();
          return;
        }
        if (user.role !== role) {
          useAuthStore.getState().setSession(user.role, user.name);
        }
        useProfileStore.getState().hydrateFromApi({
          name: user.name,
          address: user.address,
          faculty: user.faculty,
          studyStyle: user.studyStyle,
          noiseLevel: user.noiseLevel,
          studyType: user.studyType,
          amenities: user.amenities,
          profileImg: user.profileImg,
        });
      } catch {
        // Backend unreachable — keep the persisted role.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
