import { create } from "zustand";

export type OptionCategory =
  | "wifi"
  | "noise"
  | "crowd"
  | "studyEnvironment"
  | "amenities"
  | "seats";

export interface AdminOption {
  id: string;
  category: OptionCategory;
  label: string;
  active: boolean;
  order: number;
}

export const OPTION_CATEGORY_LABELS: Record<OptionCategory, string> = {
  wifi: "Wi-Fi strength",
  noise: "Noise level",
  crowd: "Crowd level",
  studyEnvironment: "Study environment",
  amenities: "Available facilities",
  seats: "Seating availability",
};

const initialOptions: AdminOption[] = [
  ["wifi", ["Strong", "Medium", "Weak"]],
  ["noise", ["Low", "Medium", "High", "Quiet", "Moderate", "Loud"]],
  ["crowd", ["Low", "Medium", "High"]],
  ["studyEnvironment", ["Quiet", "Focused", "Social", "Individual", "Group", "Hybrid"]],
  ["amenities", ["Wi-Fi", "Power outlet", "Cafeteria", "Printer", "Parking", "Elevator", "Accessible seating"]],
  ["seats", ["Yes", "No", "Unsure"]],
].flatMap(([category, labels]) =>
  (labels as string[]).map((label, order) => ({
    id: `${category}-${order + 1}`,
    category: category as OptionCategory,
    label,
    active: true,
    order,
  }))
);

interface AdminOptionsState {
  options: AdminOption[];
  addOption: (category: OptionCategory, label: string) => void;
  renameOption: (id: string, label: string) => void;
  toggleOption: (id: string) => void;
  deleteOption: (id: string) => void;
  moveOption: (id: string, direction: "up" | "down") => void;
  getOptions: (category: OptionCategory, includeInactive?: boolean) => AdminOption[];
}

export const useAdminOptionsStore = create<AdminOptionsState>((set, get) => ({
  options: initialOptions,
  addOption: (category, label) =>
    set((state) => {
      const categoryOptions = state.options.filter((option) => option.category === category);
      return {
        options: [
          ...state.options,
          {
            id: `${category}-${Date.now()}`,
            category,
            label: label.trim(),
            active: true,
            order: categoryOptions.length,
          },
        ],
      };
    }),
  renameOption: (id, label) =>
    set((state) => ({
      options: state.options.map((option) =>
        option.id === id ? { ...option, label: label.trim() } : option
      ),
    })),
  toggleOption: (id) =>
    set((state) => ({
      options: state.options.map((option) =>
        option.id === id ? { ...option, active: !option.active } : option
      ),
    })),
  deleteOption: (id) =>
    set((state) => {
      const removed = state.options.find((option) => option.id === id);
      if (!removed) return state;
      return {
        options: state.options
          .filter((option) => option.id !== id)
          .map((option) =>
            option.category === removed.category && option.order > removed.order
              ? { ...option, order: option.order - 1 }
              : option
          ),
      };
    }),
  moveOption: (id, direction) =>
    set((state) => {
      const current = state.options.find((option) => option.id === id);
      if (!current) return state;
      const targetOrder = current.order + (direction === "up" ? -1 : 1);
      const target = state.options.find(
        (option) => option.category === current.category && option.order === targetOrder
      );
      if (!target) return state;
      return {
        options: state.options.map((option) => {
          if (option.id === current.id) return { ...option, order: target.order };
          if (option.id === target.id) return { ...option, order: current.order };
          return option;
        }),
      };
    }),
  getOptions: (category, includeInactive = false) =>
    get()
      .options.filter((option) => option.category === category && (includeInactive || option.active))
      .sort((a, b) => a.order - b.order),
}));
