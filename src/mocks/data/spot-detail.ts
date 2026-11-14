import type { SpotDetail, SpotReview } from "@/features/student/types/spot-detail";
import { studySpotCatalog } from "@/mocks/data/study-spots";

export const spotDetail: SpotDetail = {
  slug: "uom-library",
  name: "UoM Library — Basement Study Hall",
  rating: 4.9,
  reviewCount: 128,
  staffMonitored: true,
  hero: {
    image: "/assets/home/838a8.png",
    alt: "Students studying at long tables in the UoM Library basement study hall",
    photoCount: 4,
  },
  hours: {
    isOpen: true,
    openLabel: "Open now",
    closesLabel: "Closes at 10:00 PM",
    peakLabel: "Peak 6–8 PM",
    segments: [
      { label: "Closed 6–8 AM", weight: 38, tone: "closed" },
      { label: "Open 8 AM–6 PM", weight: 188, tone: "open" },
      { label: "Peak 6–8 PM", weight: 37, tone: "peak" },
      { label: "Open 8–10 PM", weight: 38, tone: "open" },
      { label: "Closed 10 PM–12 AM", weight: 37, tone: "closed" },
    ],
    labels: [
      { label: "6 AM", left: 0 },
      { label: "9 AM", left: 12.62 },
      { label: "12 PM", left: 28.71 },
      { label: "3 PM", left: 46.1 },
      { label: "6 PM", left: 62.77 },
      { label: "9 PM", left: 79.43 },
      { label: "12 AM", left: 90.46 },
    ],
  },
  lastUpdated: "Updated 12 min ago",
  metrics: [
    {
      id: "seats",
      label: "Seats available",
      value: "Available",
      icon: "armchair",
      iconBackground: "rgba(16, 185, 129, 0.14)",
      iconColor: "#10b981",
      segments: [
        { label: "Available", color: "#10b981" },
        { label: "Limited", color: "#19bc86" },
        { label: "Full", color: "#19bc86" },
      ],
    },
    {
      id: "wifi",
      label: "Wi-Fi Strength",
      value: "Medium",
      icon: "wifi",
      iconBackground: "rgba(66, 133, 244, 0.14)",
      iconColor: "#4285f4",
      segments: [
        { label: "Strong", color: "#4285f4" },
        { label: "Medium", color: "#498af4" },
        { label: "Weak", color: "#e2e8f0" },
      ],
    },
    {
      id: "crowd",
      label: "Crowd level",
      value: "Low",
      icon: "users",
      iconBackground: "rgba(249, 115, 22, 0.14)",
      iconColor: "#f97316",
      segments: [
        { label: "Low", color: "#f97316" },
        { label: "Medium", color: "#e2e8f0" },
        { label: "High", color: "#e2e8f0" },
      ],
    },
    {
      id: "noise",
      label: "Noise level",
      value: "Quiet",
      icon: "volume",
      iconBackground: "rgba(139, 92, 246, 0.14)",
      iconColor: "#8b5cf6",
      segments: [
        { label: "Quiet", color: "#8b5cf6" },
        { label: "Moderate", color: "#e2e8f0" },
        { label: "Loud", color: "#e2e8f0" },
      ],
    },
  ],
  amenities: [
    {
      label: "Study Carrels",
      detail: "Individual quiet desks",
      icon: "/assets/detail/e70fe.svg",
      iconWidth: 16.667,
      iconHeight: 15,
    },
    {
      label: "Open Study Tables",
      detail: "350 total seats",
      icon: "/assets/detail/1f4f4.svg",
      iconWidth: 20,
      iconHeight: 39,
    },
    {
      label: "Campus Wi-Fi",
      detail: "CITes network access",
      icon: "/assets/detail/165b6.svg",
      iconWidth: 11.667,
      iconHeight: 15,
    },
    {
      label: "Power Outlets",
      detail: "At every study desk",
      icon: "/assets/detail/c6e1e.svg",
      iconWidth: 18.333,
      iconHeight: 18.333,
    },
    {
      label: "Bag Counter",
      detail: "At the main entrance",
      icon: "/assets/detail/4dc4b.svg",
      iconWidth: 13.333,
      iconHeight: 16.667,
    },
    {
      label: "Silent Policy",
      detail: "Monitored at all times",
      icon: "/assets/detail/f5477.svg",
      iconWidth: 15,
      iconHeight: 15,
    },
  ],
  reviews: {
    verdict: "Highly rated",
    verdictDetail: "Based on verified campus check-ins",
    mentions: ["Quiet", "Plenty of outlets", "Great for groups"],
    items: [
      {
        id: "review-marcus",
        rating: 5,
        initials: "MC",
        author: "Marcus Chen",
        year: "IT '26",
        meta: "2 hours ago • Carrel 12",
        text: "Dead silent till 10 PM — the basement carrels are my go-to before exams. Plenty of seats so there's always space, and CITes Wi-Fi never drops when I'm deep in a problem set.",
        avatarBackground: "#ffdbca",
        avatarColor: "#9d4300",
      },
      {
        id: "review-elena",
        rating: 4,
        initials: "ER",
        author: "Elena Rostova",
        year: "Architecture '27",
        meta: "Yesterday • Table 5",
        text: "Grabbed a shared table with friends last night. Carrels fill up by mid-morning, so come early if you want one — outlets are everywhere and it stays whisper quiet until closing at 10.",
        avatarBackground: "#d5e3fd",
        avatarColor: "#57657b",
      },
    ],
  },
};

const reviewAuthors = [
  { name: "Nethmi Perera", initials: "NP", year: "IT '26", background: "#ffdbca", color: "#9d4300" },
  { name: "Kasun Wijesinghe", initials: "KW", year: "Engineering '27", background: "#d5e3fd", color: "#57657b" },
  { name: "Ayesha Fernando", initials: "AF", year: "Architecture '26", background: "#d9f4e5", color: "#166534" },
  { name: "Ravindu Silva", initials: "RS", year: "Science '27", background: "#fce7f3", color: "#9d174d" },
  { name: "Tharushi Jayasinghe", initials: "TJ", year: "Civil '28", background: "#fef3c7", color: "#92400e" },
];

function getCatalogReviews(spot: (typeof studySpotCatalog)[number]): SpotReview[] {
  const primaryAmenity = spot.amenities[0] ?? "study space";
  const secondaryAmenity = spot.amenities[1] ?? "comfortable seating";
  const reviewTexts = [
    `A useful ${spot.category.toLowerCase()} for focused work. The ${primaryAmenity.toLowerCase()} made it easy to settle in for a long session.`,
    `Good option between classes. I liked the ${secondaryAmenity.toLowerCase()} and the location near ${spot.area.split("·")[0].trim()}.`,
    `The space matched the description and worked well for a small group. Come earlier if you want the best seats.`,
  ];

  return reviewAuthors.slice(0, 3).map((author, index) => ({
    id: `${spot.slug}-seed-review-${index + 1}`,
    rating: Math.max(3, Math.min(5, Math.round(spot.rating + (index === 1 ? -1 : 0)))),
    initials: author.initials,
    author: author.name,
    year: author.year,
    meta: `${index === 0 ? "2 days ago" : index === 1 ? "Last week" : "2 weeks ago"} • ${spot.category}`,
    text: reviewTexts[index],
    avatarBackground: author.background,
    avatarColor: author.color,
  }));
}

export function getCatalogSpotDetail(slug: string): SpotDetail | undefined {
  const spot = studySpotCatalog.find((item) => item.slug === slug);

  if (!spot) return undefined;

  const iconPool = [
    { icon: "/assets/detail/e70fe.svg", iconWidth: 16.667, iconHeight: 15 },
    { icon: "/assets/detail/1f4f4.svg", iconWidth: 20, iconHeight: 39 },
    { icon: "/assets/detail/165b6.svg", iconWidth: 11.667, iconHeight: 15 },
    { icon: "/assets/detail/c6e1e.svg", iconWidth: 18.333, iconHeight: 18.333 },
    { icon: "/assets/detail/4dc4b.svg", iconWidth: 13.333, iconHeight: 16.667 },
    { icon: "/assets/detail/f5477.svg", iconWidth: 15, iconHeight: 15 },
  ];
  const activeColor = "#10b981";
  const inactiveColor = "#e2e8f0";
  const wifiActiveColor = "#4285f4";
  const noiseActiveColor = "#8b5cf6";
  const noise = spot.crowd === "Low" ? "Quiet" : spot.crowd === "Medium" ? "Moderate" : "Loud";

  return {
    slug: spot.slug,
    name: spot.name,
    rating: spot.rating,
    reviewCount: spot.reviews,
    staffMonitored: false,
    hero: {
      image: spot.imageUrls[0],
      alt: `${spot.name} at the University of Moratuwa`,
      photoCount: spot.imageUrls.length,
    },
    hours: {
      isOpen: true,
      openLabel: spot.hours,
      closesLabel: "Check with the department",
      peakLabel: "Availability varies",
      segments: [
        { label: "Closed", weight: 20, tone: "closed" },
        { label: "Open", weight: 220, tone: "open" },
        { label: "Availability varies", weight: 60, tone: "peak" },
        { label: "Closed", weight: 40, tone: "closed" },
      ],
      labels: [
        { label: "Morning", left: 0 },
        { label: "Midday", left: 30 },
        { label: "Afternoon", left: 60 },
        { label: "Evening", left: 84 },
      ],
    },
    lastUpdated: spot.lastUpdated,
    metrics: [
      {
        id: "seats",
        label: "Seats available",
        value: spot.seats,
        icon: "armchair",
        iconBackground: "rgba(16, 185, 129, 0.14)",
        iconColor: "#10b981",
        segments: ["Yes", "No", "Unsure"].map((label) => ({
          label,
          color: label === spot.seats ? activeColor : inactiveColor,
        })),
      },
      {
        id: "wifi",
        label: "Wi-Fi Strength",
        value: spot.wifi,
        icon: "wifi",
        iconBackground: "rgba(66, 133, 244, 0.14)",
        iconColor: "#4285f4",
        segments: ["Strong", "Medium", "Weak"].map((label) => ({
          label,
          color: label === spot.wifi ? wifiActiveColor : inactiveColor,
        })),
      },
      {
        id: "crowd",
        label: "Crowd level",
        value: spot.crowd,
        icon: "users",
        iconBackground: "rgba(249, 115, 22, 0.14)",
        iconColor: "#f97316",
        segments: ["Low", "Medium", "High"].map((label) => ({
          label,
          color: label === spot.crowd ? "#f97316" : inactiveColor,
        })),
      },
      {
        id: "noise",
        label: "Noise level",
        value: noise,
        icon: "volume",
        iconBackground: "rgba(139, 92, 246, 0.14)",
        iconColor: noiseActiveColor,
        segments: ["Quiet", "Moderate", "Loud"].map((label) => ({
          label,
          color: label === noise ? noiseActiveColor : inactiveColor,
        })),
      },
    ],
    amenities: spot.amenities.slice(0, 6).map((label, index) => ({
      label,
      detail: spot.description,
      ...iconPool[index % iconPool.length],
    })),
    reviews: {
      verdict: `${spot.rating.toFixed(1)} rated`,
      verdictDetail: spot.description,
      mentions: spot.amenities.slice(0, 3),
      items: getCatalogReviews(spot),
    },
  };
}
