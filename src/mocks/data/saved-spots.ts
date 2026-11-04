export interface SavedSpotAmenity {
  label: string;
  /** Figma icon asset shown inside the saved-card chip. */
  icon: string;
}

export interface SavedSpotCard {
  /** Route slug under `/student/results/[slug]` — also the saved-state key. */
  slug: string;
  name: string;
  subtitle: string;
  rating: number;
  reviews: number;
  image: string;
  amenities: SavedSpotAmenity[];
  /** Figma treatment for the card shell on the Saved tab. */
  variant: "flat" | "outlined";
}

/**
 * Every place that can appear on the Saved tab. The Discover tiles and the
 * spot info page toggle these same slugs through `useSavedStore`.
 */
export const savedSpotCatalog: Record<string, SavedSpotCard> = {
  "uom-library": {
    slug: "uom-library",
    name: "UoM Library — Basement Study Hall",
    subtitle: "University Library · Basement floor",
    rating: 4.8,
    reviews: 312,
    image: "/assets/home/838a8.png",
    amenities: [
      { label: "Wi-Fi", icon: "/assets/saved/1e4ff.svg" },
      { label: "Power outlets", icon: "/assets/saved/5a32e.svg" },
      { label: "Silent zones", icon: "/assets/home/065c7.svg" },
    ],
    variant: "flat",
  },
  "faculty-architecture": {
    slug: "faculty-architecture",
    name: "Faculty of Architecture Studios",
    subtitle: "Faculty of Architecture · Katubedda",
    rating: 4.7,
    reviews: 154,
    image: "/assets/home/3c32d.png",
    amenities: [
      { label: "Design studios", icon: "/assets/home/22296.svg" },
      { label: "Power outlets", icon: "/assets/saved/5a32e.svg" },
      { label: "Open late", icon: "/assets/home/8e024.svg" },
    ],
    variant: "flat",
  },
  "faculty-engineering": {
    slug: "faculty-engineering",
    name: "Faculty of Engineering Halls",
    subtitle: "Faculty of Engineering",
    rating: 4.5,
    reviews: 203,
    image: "/assets/saved/64a28.png",
    amenities: [
      { label: "Wi-Fi", icon: "/assets/saved/1e4ff.svg" },
      { label: "Spacious seating", icon: "/assets/saved/3d652.svg" },
      { label: "Power outlets", icon: "/assets/saved/5a32e.svg" },
    ],
    variant: "outlined",
  },
  "faculty-it": {
    slug: "faculty-it",
    name: "Faculty of IT Computer Labs",
    subtitle: "Faculty of Information Technology",
    rating: 4.6,
    reviews: 176,
    image: "/assets/saved/26beb.png",
    amenities: [
      { label: "Computers", icon: "/assets/saved/3e147.svg" },
      { label: "Wi-Fi", icon: "/assets/saved/1e4ff.svg" },
      { label: "Power outlets", icon: "/assets/saved/5a32e.svg" },
    ],
    variant: "flat",
  },
  "uom-library-discussion": {
    slug: "uom-library-discussion",
    name: "UoM Library — Discussion Room",
    subtitle: "University Library · 1st floor",
    rating: 4.6,
    reviews: 98,
    image: "/assets/home/0992e.png",
    amenities: [
      { label: "Group study", icon: "/assets/home/28e91.svg" },
      { label: "Wi-Fi", icon: "/assets/saved/1e4ff.svg" },
      { label: "Near photocopier", icon: "/assets/saved/3e147.svg" },
    ],
    variant: "flat",
  },
};

/**
 * Figma's Saved tab shows the IT labs first, then Engineering Halls.
 * New saves are appended, so this is also the initial render order.
 */
export const DEFAULT_SAVED_SLUGS = ["faculty-it", "faculty-engineering"] as const;
