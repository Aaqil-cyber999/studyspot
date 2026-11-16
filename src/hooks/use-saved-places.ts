"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/services/api";
import type { ApiLocation } from "@/services/student";

export interface SavedPlaceRow {
  locationId: string;
  location: ApiLocation;
}

async function fetchSavedPlaces(): Promise<SavedPlaceRow[]> {
  const rows = await api.get<Array<{ locationId: string; location: ApiLocation }>>("/saved");
  return rows;
}

/**
 * Live saved-places state backed by /api/saved. Replaces the old in-memory
 * saved store: every bookmark button reads from (and writes to) the same
 * server state, so tabs stay in sync.
 */
export function useSavedPlaces() {
  const queryClient = useQueryClient();
  const { data: savedPlaces = [], isPending } = useQuery({
    queryKey: ["saved", "places"],
    queryFn: fetchSavedPlaces,
  });

  const setSaved = useCallback(
    (locationId: string, save: boolean) => {
      queryClient.setQueryData<SavedPlaceRow[]>(["saved", "places"], (current = []) =>
        save
          ? current.some((row) => row.locationId === locationId)
            ? current
            : [...current]
          : current.filter((row) => row.locationId !== locationId),
      );
      const fn = save
        ? () => api.post("/saved", { locationId })
        : () => api.del(`/saved/${locationId}`);
      return fn()
        .catch((error: unknown) => {
          // Roll back optimistic update on failure.
          void queryClient.invalidateQueries({ queryKey: ["saved", "places"] });
          if (error instanceof ApiError && error.status === 401) {
            throw new Error("Your session has expired. Please sign in again.");
          }
          throw error instanceof Error ? error : new Error("Unable to update saved places.");
        })
        .finally(() => {
          void queryClient.invalidateQueries({ queryKey: ["saved", "places"] });
        });
    },
    [queryClient],
  );

  const mutation = useMutation({
    mutationFn: ({ locationId, save }: { locationId: string; save: boolean }) =>
      setSaved(locationId, save),
  });

  const toggleSaved = useCallback(
    (locationId: string) => {
      const isSaved = savedPlaces.some((row) => row.locationId === locationId);
      mutation.mutate({ locationId, save: !isSaved });
      return !isSaved;
    },
    [mutation, savedPlaces],
  );

  const removeSaved = useCallback(
    (locationId: string) => {
      mutation.mutate({ locationId, save: false });
    },
    [mutation],
  );

  const isPendingPlace = mutation.isPending;

  return {
    savedPlaces,
    isPending,
    toggleSaved,
    removeSaved,
    savedIds: new Set(savedPlaces.map((row) => row.locationId)),
    isPendingPlace,
  };
}
