import { create } from "zustand";

export interface ReportDraft {
  noise: string;
  crowd: string;
  seats: string;
  wifi: string;
  comment: string;
}

export const DEFAULT_REPORT: ReportDraft = {
  noise: "Quiet",
  crowd: "Low",
  seats: "Yes",
  wifi: "Strong",
  comment: "",
};

interface ReportStore extends ReportDraft {
  setReport: (report: ReportDraft) => void;
  resetReport: () => void;
}

/** In-memory draft shared by the status form and the review step. */
export const useReportStore = create<ReportStore>((set) => ({
  ...DEFAULT_REPORT,
  setReport: (report) => set(report),
  resetReport: () => set(DEFAULT_REPORT),
}));
