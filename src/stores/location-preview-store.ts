import { create } from "zustand";

export interface LocationPreviewImageItem {
  url: string;
  file: File | null;
}

export interface LocationPreviewData {
  name: string;
  building: string;
  faculty?: string;
  department?: string;
  description?: string;
  staffMonitored: boolean;
  amenities: string[];
  hours: string;
  imageItems: LocationPreviewImageItem[];
  openTimeMode: string;
  peakEnabled: boolean;
  peakStart: string;
  peakEnd: string;
  isEditing?: boolean;
  locationId?: string;
}

interface LocationPreviewStore {
  data: LocationPreviewData | null;
  setData: (data: LocationPreviewData) => void;
  clearData: () => void;
}

export const useLocationPreviewStore = create<LocationPreviewStore>((set) => ({
  data: null,
  setData: (data) => set({ data }),
  clearData: () => set({ data: null }),
}));