import type { LiveMetric, OperatingHours, SpotAmenity } from "@/features/student/types/spot-detail";

/**
 * Enrichment for the super-admin location records (`sa-loc-*`) with the same
 * shape of information students see on the spot detail screen — hero photo,
 * operating hours, live metrics, amenities — so the detail page can render a
 * full desktop layout. Static by design: the persisted super-admin store only
 * holds the minimal location record, this lookup supplies the rest.
 */
export interface SaLocationDetail {
  building: string;
  description: string;
  image: string;
  photoCount: number;
  staffMonitored: boolean;
  lastUpdated: string;
  hours: OperatingHours;
  metrics: LiveMetric[];
  amenities: SpotAmenity[];
}

const seatsMetric = (value: "Available" | "Limited" | "Unsure" | "Full"): LiveMetric => ({
  id: "seats",
  label: "Seats available",
  value,
  icon: "armchair",
  iconBackground: "rgba(16, 185, 129, 0.14)",
  iconColor: "#10b981",
  segments: [
    { label: "Available", color: "#10b981" },
    { label: "Limited", color: "#19bc86" },
    { label: "Full", color: "#19bc86" },
  ],
});

const wifiMetric = (value: "Strong" | "Medium" | "Weak"): LiveMetric => ({
  id: "wifi",
  label: "Wi-Fi Strength",
  value,
  icon: "wifi",
  iconBackground: "rgba(66, 133, 244, 0.14)",
  iconColor: "#4285f4",
  segments: [
    { label: "Strong", color: "#4285f4" },
    { label: "Medium", color: "#498af4" },
    { label: "Weak", color: "#e2e8f0" },
  ],
});

const crowdMetric = (value: "Low" | "Medium" | "High"): LiveMetric => ({
  id: "crowd",
  label: "Crowd level",
  value,
  icon: "users",
  iconBackground: "rgba(249, 115, 22, 0.14)",
  iconColor: "#f97316",
  segments: [
    { label: "Low", color: "#f97316" },
    { label: "Medium", color: "#e2e8f0" },
    { label: "High", color: "#e2e8f0" },
  ],
});

const noiseMetric = (value: "Quiet" | "Moderate" | "Loud"): LiveMetric => ({
  id: "noise",
  label: "Noise level",
  value,
  icon: "volume",
  iconBackground: "rgba(139, 92, 246, 0.14)",
  iconColor: "#8b5cf6",
  segments: [
    { label: "Quiet", color: "#8b5cf6" },
    { label: "Moderate", color: "#e2e8f0" },
    { label: "Loud", color: "#e2e8f0" },
  ],
});

const metrics = (
  seats: Parameters<typeof seatsMetric>[0],
  wifi: Parameters<typeof wifiMetric>[0],
  crowd: Parameters<typeof crowdMetric>[0],
  noise: Parameters<typeof noiseMetric>[0],
): LiveMetric[] => [seatsMetric(seats), wifiMetric(wifi), crowdMetric(crowd), noiseMetric(noise)];

const timelineLabels: OperatingHours["labels"] = [
  { label: "6 AM", left: 0 },
  { label: "9 AM", left: 12.62 },
  { label: "12 PM", left: 28.71 },
  { label: "3 PM", left: 46.1 },
  { label: "6 PM", left: 62.77 },
  { label: "9 PM", left: 79.43 },
  { label: "12 AM", left: 90.46 },
];

const standardSegments: OperatingHours["segments"] = [
  { label: "Closed 6–8 AM", weight: 38, tone: "closed" },
  { label: "Open 8 AM–6 PM", weight: 188, tone: "open" },
  { label: "Peak 6–8 PM", weight: 37, tone: "peak" },
  { label: "Open 8–10 PM", weight: 38, tone: "open" },
  { label: "Closed 10 PM–12 AM", weight: 37, tone: "closed" },
];

const closedSegments: OperatingHours["segments"] = [
  { label: "Closed all day", weight: 300, tone: "closed" },
];

const hours = (closesLabel: string, peakLabel: string): OperatingHours => ({
  isOpen: true,
  openLabel: "Open now",
  closesLabel,
  peakLabel,
  segments: standardSegments,
  labels: timelineLabels,
});

const amenity = (label: string, detail: string, icon: string, iconWidth: number, iconHeight: number): SpotAmenity => ({
  label,
  detail,
  icon,
  iconWidth,
  iconHeight,
});

const carrel = (label: string, detail: string) => amenity(label, detail, "/assets/detail/e70fe.svg", 16.667, 15);
const table = (label: string, detail: string) => amenity(label, detail, "/assets/detail/1f4f4.svg", 20, 39);
const wifi = (label: string, detail: string) => amenity(label, detail, "/assets/detail/165b6.svg", 11.667, 15);
const outlet = (label: string, detail: string) => amenity(label, detail, "/assets/detail/c6e1e.svg", 18.333, 18.333);
const counter = (label: string, detail: string) => amenity(label, detail, "/assets/detail/4dc4b.svg", 13.333, 16.667);
const quiet = (label: string, detail: string) => amenity(label, detail, "/assets/detail/f5477.svg", 15, 15);

export const saLocationDetails: Record<string, SaLocationDetail> = {
  "sa-loc-1": {
    building: "Central Library · 1st Floor",
    description:
      "Open-plan quiet study zone on the first floor of the Central Library, with individual carrels, shared tables and bookable discussion rooms. Popular with undergraduates before exams; monitored during opening hours.",
    image: "/assets/home/838a8.png",
    photoCount: 4,
    staffMonitored: true,
    lastUpdated: "Updated 12 min ago",
    hours: hours("Closes at 10:00 PM", "Peak 6–8 PM"),
    metrics: metrics("Available", "Strong", "Low", "Quiet"),
    amenities: [
      carrel("Study Carrels", "Individual quiet desks"),
      table("Open Study Tables", "350 total seats"),
      wifi("Campus Wi-Fi", "CITS network access"),
      outlet("Power Outlets", "At every study desk"),
      counter("Bag Counter", "At the main entrance"),
      quiet("Silent Policy", "Monitored at all times"),
    ],
  },
  "sa-loc-2": {
    building: "Engineering Block A · Level 2",
    description:
      "Double-height study hall shared by all engineering departments. Group tables up front and silent carrels along the back wall. Gets busy after 4 PM on weekdays.",
    image: "/assets/home/3c32d.png",
    photoCount: 3,
    staffMonitored: true,
    lastUpdated: "Updated 18 min ago",
    hours: hours("Closes at 9:00 PM", "Peak 5–7 PM"),
    metrics: metrics("Available", "Medium", "Medium", "Moderate"),
    amenities: [
      table("Engineering Tables", "Group seating, Level 2"),
      carrel("Study Carrels", "40 quiet carrels"),
      wifi("Campus Wi-Fi", "EDUROAM + campus Wi-Fi"),
      outlet("Power Outlets", "Along every bench"),
      counter("Lockers", "At the Level 2 entrance"),
      quiet("Quiet Hours", "After 6 PM on weekdays"),
    ],
  },
  "sa-loc-3": {
    building: "Main Library · Ground & 1st Floor",
    description:
      "The university's largest study space across two floors — a silent reading room upstairs and a flexible group floor downstairs. Bright, calm and the busiest library on campus.",
    image: "/assets/results/838a8.png",
    photoCount: 6,
    staffMonitored: true,
    lastUpdated: "Updated 8 min ago",
    hours: hours("Closes at 11:00 PM", "Peak 7–9 PM"),
    metrics: metrics("Available", "Strong", "Low", "Quiet"),
    amenities: [
      table("Reading Rooms", "Two floors, 480 seats"),
      carrel("Study Carrels", "120 carrels upstairs"),
      wifi("Campus Wi-Fi", "University network"),
      outlet("Power Outlets", "Every reading bay"),
      counter("Bag Counter", "Ground floor entrance"),
      quiet("Silent Policy", "Upstairs floor only"),
    ],
  },
  "sa-loc-4": {
    building: "Learning Commons · Level 3",
    description:
      "Flexible lounge-style commons above the library with soft seating and whiteboard walls. Suited to group work; extra monitors are available on request at the help desk.",
    image: "/assets/home/296f7.png",
    photoCount: 3,
    staffMonitored: false,
    lastUpdated: "Updated 24 min ago",
    hours: hours("Closes at 8:00 PM", "Peak 4–6 PM"),
    metrics: metrics("Unsure", "Medium", "Medium", "Moderate"),
    amenities: [
      table("Open Study Tables", "120 seats"),
      carrel("Soft Seating", "Lounge & booth seating"),
      wifi("Campus Wi-Fi", "EDUROAM coverage"),
      outlet("Power Outlets", "Every table and booth"),
      counter("Help Desk", "Level 3, staffed daily"),
      quiet("Group Rooms", "Bookable 2-hour slots"),
    ],
  },
  "sa-loc-5": {
    building: "Science Faculty · 2nd Floor",
    description:
      "Compact reading room for science undergraduates and postgraduates. Reference shelves along one wall and shared tables for 60. Quietest after classes end at 5 PM.",
    image: "/assets/home/0992e.png",
    photoCount: 2,
    staffMonitored: false,
    lastUpdated: "Updated 31 min ago",
    hours: hours("Closes at 8:00 PM", "Peak 6–8 PM"),
    metrics: metrics("Limited", "Medium", "High", "Moderate"),
    amenities: [
      table("Reading Tables", "60 shared seats"),
      carrel("Reference Shelves", "Sci-tech collection"),
      wifi("Campus Wi-Fi", "Faculty network"),
      outlet("Power Outlets", "Half the desks"),
      counter("Bag Counter", "2nd floor entrance"),
      quiet("Quiet Hours", "After 5 PM daily"),
    ],
  },
  "sa-loc-6": {
    building: "Engineering Building · Ground Floor",
    description:
      "Small open reading area near the engineering faculty office. Seating for 40 with a projector corner for informal group prep. Currently listed inactive pending refurbishment.",
    image: "/assets/home/64a28.png",
    photoCount: 2,
    staffMonitored: false,
    lastUpdated: "Reported 2 days ago",
    hours: {
      isOpen: false,
      openLabel: "Closed now",
      closesLabel: "Closed for refurbishment",
      peakLabel: "Reopens Jan",
      segments: closedSegments,
      labels: timelineLabels,
    },
    metrics: metrics("Full", "Weak", "High", "Loud"),
    amenities: [
      table("Shared Tables", "40 seats"),
      carrel("Projector Corner", "For group prep"),
      wifi("Campus Wi-Fi", "Limited coverage"),
      outlet("Power Outlets", "Every 4th desk"),
      counter("Lockers", "Ground floor"),
      quiet("Quiet Hours", "Not currently"),
    ],
  },
  "sa-loc-7": {
    building: "IT Faculty · Lab Building",
    description:
      "Two supervised computer labs with 120 workstations, open to all undergraduates outside lecture hours. Headphones provided at the door; printing is handled at the help desk.",
    image: "/assets/home/26beb.png",
    photoCount: 3,
    staffMonitored: true,
    lastUpdated: "Updated 15 min ago",
    hours: hours("Closes at 10:00 PM", "Peak 6–8 PM"),
    metrics: metrics("Available", "Strong", "Low", "Quiet"),
    amenities: [
      table("Computer Workstations", "120 seats, headphones provided"),
      carrel("Software Suite", "Programming & CAD tools"),
      wifi("Lab Network", "Private lab LAN"),
      outlet("Power Outlets", "Every workstation"),
      counter("Print Station", "Help desk, ground floor"),
      quiet("Staffed Hours", "Monitored at all times"),
    ],
  },
  "sa-loc-8": {
    building: "Main Library · North Wing",
    description:
      "North reading wing of the main library, focused on postgraduate study. Silent desks, the thesis collection and two group consultation rooms. Calm even during exam season.",
    image: "/assets/saved/26beb.png",
    photoCount: 4,
    staffMonitored: true,
    lastUpdated: "Updated 26 min ago",
    hours: hours("Closes at 9:00 PM", "Peak 5–7 PM"),
    metrics: metrics("Available", "Medium", "Low", "Quiet"),
    amenities: [
      carrel("Study Carrels", "200 postgrad desks"),
      table("Thesis Collection", "North wing shelves"),
      wifi("Campus Wi-Fi", "EDUROAM"),
      outlet("Power Outlets", "At every carrel"),
      counter("Bag Counter", "North entrance"),
      quiet("Silent Policy", "Enforced all day"),
    ],
  },
};
