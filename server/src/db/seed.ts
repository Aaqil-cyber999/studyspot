import dotenv from "dotenv";
dotenv.config();
import { db } from "./index.js";
import {
  universities,
  students,
  universityAdmins,
  superAdmins,
  locations,
  reviews,
  savedPlaces,
  registrationRequests,
  reportOptions,
  otpCodes,
  reviewVotes,
  locationHours,
  amenities,
} from "./schema.js";
import { hashPassword } from "../lib/hash.js";
import { count, eq } from "drizzle-orm";

/**
 * Deterministic seed for a fresh database, mirroring the frontend design mocks:
 *  - 6 universities, super-admin, 5 university-admins, 1 student, 8 mock author students
 *  - 20 student-catalog spots (UoM) + 8 platform-wide admin locations
 *  - Ratings/review counts are produced by generating deterministic reviews that
 *    average to the exact mock rating (integer 1–5 distribution) — so the
 *    locations API returns the same numbers the frontend shows in Figma.
 *  - Saved places for the student (faculty-it, faculty-engineering).
 *
 * Never run this against a database you care about.
 */

const SUPER_ADMIN_PASSWORD = process.env.SEED_SUPER_ADMIN_PASSWORD ?? "admin123";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "admin123";
const STUDENT_PASSWORD = process.env.SEED_STUDENT_PASSWORD ?? "password123";

const AVATAR_COLORS = ["#f97316", "#ea580c", "#c2410c", "#fb923c", "#334155", "#0f172a", "#475569", "#f59e0b"];

/** Tiny deterministic SVG initials avatar as a data URL (works in <img>). */
function initialsAvatar(name: string, colorIndex: number): string {
  const initials = name
    .split(/\s+/)
    .filter((word) => word && !word.endsWith("."))
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join("");
  const fill = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><circle cx="48" cy="48" r="48" fill="${fill}"/><text x="48" y="63" font-family="Arial, sans-serif" font-size="37" font-weight="700" text-anchor="middle" fill="#ffffff">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Deterministic PRNG so re-seeding always yields the same dataset.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const REVIEW_SNIPPETS = [
  "Bright, calm and reliable Wi-Fi.",
  "Plenty of open desks in the mornings.",
  "Gets busy right after lectures end.",
  "Good lighting and quiet corners upstairs.",
  "Wi-Fi is solid near the entrance.",
  "Bring a charger — outlets are limited.",
  "Peaceful reading room on the upper floor.",
  "Best spot on campus for deep work.",
  "A bit noisy at lunchtime.",
  "Helpful staff and clean tables.",
  "Great for revision during exam season.",
  "Comfortable seating and fast computers.",
];

// Order must match the authorUsers insertion below (index into authorIds).
const AUTHOR_NAMES = [
  "Mohamed",
  "Sahan Perera",
  "Nimasha Fernando",
  "Kasun Jayasuriya",
  "Dinuka Ramanayake",
  "Maleesha De Silva",
  "Anika Senanayake",
  "Tharushi Wickramasinghe",
  "Ishara Fernando",
  "Roshan Mendis",
];

const DAY_MS = 24 * 60 * 60 * 1000;

interface CuratedComment {
  author: string;
  rating: number;
  text: string;
  status: "Visible" | "Hidden";
  daysAgo: number;
}

interface SeedLocation {
  name: string;
  building: string | null;
  faculty: string | null;
  department: string | null;
  staffMonitored: boolean;
  address: string;
  hours: string;
  status: "Active" | "Inactive";
  seats: string;
  wifi: string;
  crowd: string;
  noise: string;
  lastReportedBy?: string | null;
  lastReportedAt?: Date | null;
  description: string;
  amenities: string[];
  imageUrls: string[];
  universityId: string;
  createdByUniversityAdminId?: string | null;
  createdBySuperAdminId?: string | null;
  ratingTarget: number;
  reviewsTarget: number;
  curated: CuratedComment[];
}

function timestampDaysAgo(daysAgo: number): Date {
  return new Date(Date.now() - daysAgo * DAY_MS);
}

function buildReviewRows(
  locationId: string,
  authorIds: string[],
  spec: SeedLocation,
  rng: () => number
) {
  const rows: Array<{
    locationId: string;
    studentId: string;
    rating: number;
    text: string;
    status: "Visible" | "Hidden";
    createdAt: Date;
  }> = [];

  const curatedSum = spec.curated.reduce((sum, c) => sum + c.rating, 0);
  for (const curated of spec.curated) {
    const authorId = authorIds[AUTHOR_NAMES.indexOf(curated.author)] ?? authorIds[0];
    rows.push({
      locationId,
      studentId: authorId,
      rating: curated.rating,
      text: curated.text,
      status: curated.status,
      createdAt: timestampDaysAgo(curated.daysAgo),
    });
  }

  const targetSum = Math.round(spec.ratingTarget * spec.reviewsTarget);
  const remaining = Math.max(spec.reviewsTarget - spec.curated.length, 0);
  if (remaining === 0) return rows;

  const remainingSum = Math.max(targetSum - curatedSum, remaining); // at least 1 star each
  const base = Math.floor(remainingSum / remaining);
  const extra = remainingSum - base * remaining;

  for (let i = 0; i < remaining; i += 1) {
    const rating = Math.min(5, Math.max(1, i < extra ? base + 1 : base));
    rows.push({
      locationId,
      studentId: authorIds[Math.floor(rng() * authorIds.length)],
      rating,
      text: REVIEW_SNIPPETS[Math.floor(rng() * REVIEW_SNIPPETS.length)],
      status: "Visible",
      createdAt: timestampDaysAgo(1 + Math.floor(rng() * 720)), // spread over ~2 years
    });
  }
  return rows;
}

// ── Student catalog (20 spots, all University of Moratuwa) ───────────────────
// Mirrors the retired src/mocks/data/study-spots.ts: same names, categories, areas, hours,
// ratings, review counts, amenities, images and seats/wifi/crowd statuses.
const CATALOG_STATUS: Array<{ seats: string; wifi: string; crowd: string }> = [
  { seats: "Yes", wifi: "Strong", crowd: "Low" },
  { seats: "Yes", wifi: "Medium", crowd: "Medium" },
  { seats: "No", wifi: "Weak", crowd: "High" },
  { seats: "Limited", wifi: "Strong", crowd: "Medium" },
  { seats: "Yes", wifi: "Weak", crowd: "High" },
  { seats: "No", wifi: "Medium", crowd: "Low" },
  { seats: "Limited", wifi: "Weak", crowd: "High" },
  { seats: "Yes", wifi: "Strong", crowd: "Medium" },
  { seats: "No", wifi: "Strong", crowd: "Low" },
  { seats: "Limited", wifi: "Medium", crowd: "High" },
  { seats: "Yes", wifi: "Medium", crowd: "Low" },
  { seats: "No", wifi: "Weak", crowd: "Medium" },
  { seats: "Limited", wifi: "Strong", crowd: "Low" },
  { seats: "Yes", wifi: "Weak", crowd: "Medium" },
  { seats: "No", wifi: "Medium", crowd: "High" },
  { seats: "Limited", wifi: "Weak", crowd: "Low" },
  { seats: "Yes", wifi: "Strong", crowd: "High" },
  { seats: "No", wifi: "Strong", crowd: "Medium" },
  { seats: "Limited", wifi: "Medium", crowd: "Low" },
  { seats: "Yes", wifi: "Weak", crowd: "High" },
];

const IMAGE_POOL = [
  "/assets/home/838a8.png",
  "/assets/home/64a28.png",
  "/assets/home/296f7.png",
  "/assets/home/0992e.png",
  "/assets/saved/64a28.png",
  "/assets/results/838a8.png",
  "/assets/home/64a28.png",
  "/assets/home/3c32d.png",
  "/assets/select-university/50ace.png",
  "/assets/select-university/265e0.png",
  "/assets/select-university/c10fd.png",
  "/assets/review/96063.png",
  "/assets/home/838a8.png",
  "/assets/home/3c32d.png",
];

const IMAGE_OVERRIDES: Record<string, string[]> = {
  "faculty-engineering": [
    "/assets/home/64a28.png",
    "/assets/home/838a8.png",
    "/assets/home/3c32d.png",
    "/assets/select-university/50ace.png",
  ],
  "bionics-laboratory": [
    "/assets/home/0992e.png",
    "/assets/home/3c32d.png",
    "/assets/home/64a28.png",
    "/assets/results/838a8.png",
  ],
};

const noiseFor = (crowd: string) => (crowd === "Low" ? "Quiet" : crowd === "Medium" ? "Moderate" : "Loud");

// Real organizational placement for every catalog spot (all University of Moratuwa).
const CATALOG_FACULTY: Record<string, string> = {
  "uom-library": "Central Library",
  "uom-library-discussion": "Central Library",
  "uom-library-reading-area": "Central Library",
  "uom-library-reference-area": "Central Library",
  "faculty-architecture": "Faculty of Architecture",
  "faculty-engineering": "Faculty of Engineering",
  "faculty-it": "Faculty of Information Technology",
  "civil-student-study-room": "Faculty of Engineering",
  "civil-graduate-computer-room": "Faculty of Engineering",
  "civil-research-centre": "Faculty of Engineering",
  "umcsawm-study-area": "Faculty of Engineering",
  "tmle-lobby": "Faculty of Engineering",
  "tmle-computer-lab": "Faculty of Engineering",
  "rs-gis-laboratory": "Faculty of Engineering",
  "oceanography-dry-lab": "Faculty of Engineering",
  "oceanography-wet-lab": "Faculty of Engineering",
  "materials-science-labs": "Faculty of Engineering",
  "biomedical-engineering-lab": "Faculty of Engineering",
  "bionics-laboratory": "Faculty of Engineering",
  "motion-analysis-lab": "Faculty of Engineering",
};

const CATALOG_DEPARTMENT: Record<string, string> = {
  "uom-library": "Library Services",
  "uom-library-discussion": "Library Services",
  "uom-library-reading-area": "Library Services",
  "uom-library-reference-area": "Library Services",
  "faculty-architecture": "Department of Architecture",
  "faculty-engineering": "All engineering departments",
  "faculty-it": "Department of Information Technology",
  "civil-student-study-room": "Department of Civil Engineering",
  "civil-graduate-computer-room": "Department of Civil Engineering",
  "civil-research-centre": "Department of Civil Engineering",
  "umcsawm-study-area": "UMCSAWM (South Asia Water Management Centre)",
  "tmle-lobby": "Department of Transport Management and Logistics Engineering",
  "tmle-computer-lab": "Department of Transport Management and Logistics Engineering",
  "rs-gis-laboratory": "Department of Earth Resources Engineering",
  "oceanography-dry-lab": "Department of Earth Resources Engineering",
  "oceanography-wet-lab": "Department of Earth Resources Engineering",
  "materials-science-labs": "Department of Materials Science and Engineering",
  "biomedical-engineering-lab": "Technology in Medicine",
  "bionics-laboratory": "Department of Mechanical Engineering",
  "motion-analysis-lab": "Department of Mechanical Engineering",
};

interface CatalogSpot {
  key: string;
  name: string;
  address: string;
  description: string;
  hours: string;
  rating: number;
  reviews: number;
  amenities: string[];
}

const CATALOG: CatalogSpot[] = [
  { key: "uom-library", name: "UoM Library — Basement Study Hall", address: "University Library · Basement floor", description: "A monitored library study hall with individual carrels, open tables, campus Wi-Fi, and long daily hours.", hours: "7:30 – 22:00 daily", rating: 4.8, reviews: 312, amenities: ["Wi-Fi", "Power outlets", "Silent zones", "Individual carrels"] },
  { key: "faculty-architecture", name: "Faculty of Architecture Studios", address: "Faculty of Architecture · Katubedda", description: "Open studio tables for architecture work, model-making, pin-ups, and collaborative coursework.", hours: "Open late", rating: 4.7, reviews: 154, amenities: ["Design studios", "Power outlets", "Open late", "Group work"] },
  { key: "faculty-engineering", name: "Faculty of Engineering Halls", address: "Faculty of Engineering · Katubedda", description: "Spacious lecture-hall foyers and shared seating that work well between engineering lectures.", hours: "Between lectures", rating: 4.5, reviews: 203, amenities: ["Wi-Fi", "Spacious seating", "Power outlets", "Group work"] },
  { key: "faculty-it", name: "Faculty of IT Computer Labs", address: "Faculty of Information Technology · Katubedda", description: "Computer-equipped teaching spaces for coding, practicals, and focused project work.", hours: "During lab sessions", rating: 4.6, reviews: 176, amenities: ["Computers", "Wi-Fi", "Power outlets", "Air conditioning"] },
  { key: "uom-library-discussion", name: "UoM Library — Discussion Room", address: "University Library · 1st floor", description: "A dedicated discussion room for small group study, presentations, and collaborative assignments.", hours: "Bookable during library hours", rating: 4.6, reviews: 98, amenities: ["Group study", "Wi-Fi", "Near photocopier", "Whiteboard"] },
  { key: "civil-student-study-room", name: "Civil Engineering Student Study Room", address: "Department of Civil Engineering · Main Building", description: "A dedicated student study room within a building that also houses lecture halls, seminar space, and laboratories.", hours: "Department hours", rating: 4.4, reviews: 67, amenities: ["Quiet seating", "Power outlets", "Seminar space", "Wi-Fi"] },
  { key: "civil-graduate-computer-room", name: "Civil Engineering Graduate Computer Room", address: "Department of Civil Engineering · Main Building", description: "Graduate computing space suited to coursework, coding, modelling, and supervised research.", hours: "For authorised users", rating: 4.5, reviews: 54, amenities: ["Computers", "Printing", "Power outlets", "Research work"] },
  { key: "civil-research-centre", name: "Civil Engineering Research Centre", address: "Department of Civil Engineering", description: "Research infrastructure for supervised civil engineering projects and postgraduate work.", hours: "For supervised research", rating: 4.3, reviews: 31, amenities: ["Research work", "Computer access", "Quiet seating", "Project space"] },
  { key: "umcsawm-study-area", name: "UMCSAWM Postgraduate Study Area", address: "South Asia Water Management Centre", description: "A postgraduate study area and library space with lecture rooms and a computer room.", hours: "For postgraduate users", rating: 4.4, reviews: 28, amenities: ["Library space", "Computers", "Lecture rooms", "Quiet seating"] },
  { key: "tmle-lobby", name: "TMLE Building Lobby Study Areas", address: "Department of Transport Management and Logistics Engineering", description: "Wi-Fi-enabled lobby areas intended for group work, continuous assessments, and exam preparation.", hours: "During department hours", rating: 4.5, reviews: 74, amenities: ["Wi-Fi", "Group work", "Casual seating", "Power outlets"] },
  { key: "tmle-computer-lab", name: "TMLE Undergraduate Computer Laboratory", address: "Department of Transport Management and Logistics Engineering", description: "A 60-computer lab used for software training, simulation, mathematical modelling, and computerised experiments.", hours: "Scheduled lab access", rating: 4.6, reviews: 83, amenities: ["60 computers", "Wi-Fi", "Simulation software", "Power outlets"] },
  { key: "rs-gis-laboratory", name: "RS & GIS Laboratory", address: "Department of Earth Resources Engineering", description: "A practical GIS and remote-sensing workspace with specialist software, scanners, printers, maps, and GPS equipment.", hours: "For scheduled coursework", rating: 4.7, reviews: 49, amenities: ["GIS software", "Printers", "Scanners", "Computers"] },
  { key: "oceanography-dry-lab", name: "Oceanography Dry Laboratory", address: "Department of Earth Resources Engineering", description: "A software-rich workspace for ocean resources, petroleum, modelling, and data-heavy project work.", hours: "For scheduled coursework", rating: 4.5, reviews: 37, amenities: ["Matlab", "Petrel", "Computers", "Project work"] },
  { key: "oceanography-wet-lab", name: "Oceanography Wet Laboratory", address: "Department of Earth Resources Engineering", description: "A supervised practical and research laboratory with oceanographic instruments and fieldwork equipment.", hours: "For supervised research", rating: 4.4, reviews: 26, amenities: ["Research equipment", "Practical work", "Oceanography", "Project space"] },
  { key: "materials-science-labs", name: "Materials Science and Engineering Laboratories", address: "Department of Materials Science and Engineering", description: "Analytical, characterisation, synthesis, and processing spaces supporting materials coursework and research.", hours: "Guided student access", rating: 4.6, reviews: 42, amenities: ["Characterisation", "Synthesis", "Processing", "Research work"] },
  { key: "biomedical-engineering-lab", name: "Biomedical Engineering Laboratory", address: "Engineering and IT faculties · Technology in Medicine", description: "Hands-on learning space for interdisciplinary medical technology coursework and projects.", hours: "During practical sessions", rating: 4.5, reviews: 35, amenities: ["Hands-on learning", "Medical technology", "Project space", "Equipment"] },
  { key: "bionics-laboratory", name: "Bionics Laboratory", address: "Department of Mechanical Engineering · Technology in Medicine", description: "A supervised hands-on laboratory for bionics-related learning, prototyping, and interdisciplinary projects.", hours: "During practical sessions", rating: 4.4, reviews: 24, amenities: ["Hands-on learning", "Prototyping", "Project space", "Equipment"] },
  { key: "motion-analysis-lab", name: "Motion Analysis Laboratory", address: "Department of Mechanical Engineering · Technology in Medicine", description: "A specialist space for supervised motion-analysis practicals and medical technology project work.", hours: "During practical sessions", rating: 4.5, reviews: 29, amenities: ["Motion analysis", "Hands-on learning", "Equipment", "Project space"] },
  { key: "uom-library-reading-area", name: "UoM Library — First-Floor Reading Area", address: "University Library · 1st floor", description: "A reading-focused library area with Wi-Fi throughout the building and access to the first-floor discussion facilities.", hours: "During library hours", rating: 4.7, reviews: 141, amenities: ["Wi-Fi", "Reading desks", "Reference books", "Quiet zones"] },
  { key: "uom-library-reference-area", name: "UoM Library — Reference and Computer Area", address: "University Library · Main building", description: "A practical library work area for reference searches, computer-supported study, and individual coursework.", hours: "During library hours", rating: 4.5, reviews: 76, amenities: ["Computers", "Wi-Fi", "Reference books", "Photocopier"] },
];

// Curated (hand-written) recent reviews; counts/ratings are included in the targets.
const CATALOG_CURATED: Record<string, CuratedComment[]> = {
  "uom-library": [
    { author: "Mohamed", rating: 5, text: "Quiet and bright.", status: "Visible", daysAgo: 3 },
  ],
  "faculty-engineering": [
    { author: "Mohamed", rating: 5, text: "Plenty of power outlets.", status: "Visible", daysAgo: 7 },
  ],
};

// ── Platform-wide locations (super-admin mock data) ─────────────────────────
const ADMIN_LOCATIONS: Array<Omit<SeedLocation, "universityId" | "createdByUniversityAdminId" | "createdBySuperAdminId"> & { key: string; universityName: string }> = [
  {
    key: "central-library-study-zone", name: "Central Library Study Zone", building: "Central Library · 1st Floor", faculty: "Central Library", department: "Library Services", staffMonitored: true,
    address: "University of Moratuwa — Central Library", hours: "8:00 AM – 10:00 PM", status: "Active",
    seats: "Yes", wifi: "Strong", crowd: "Low", noise: "Quiet",
    description: "Open-plan quiet study zone on the first floor of the Central Library, with individual carrels, shared tables and bookable discussion rooms. Monitored during opening hours.",
    amenities: ["Wi-Fi", "Power outlets", "Study carrels", "Silent policy"],
    imageUrls: ["/assets/home/838a8.png"], ratingTarget: 4.6, reviewsTarget: 214,
    curated: [
      { author: "Sahan Perera", rating: 5, text: "Quiet and bright with plenty of open desks and strong Wi-Fi.", status: "Visible", daysAgo: 3 },
    ],
    universityName: "University of Moratuwa",
  },
  {
    key: "engineering-block-study-hall", name: "Engineering Block Study Hall", building: "Engineering Block A · Level 2", faculty: "Faculty of Engineering", department: "All engineering departments", staffMonitored: true,
    address: "University of Colombo — Engineering Block A", hours: "8:00 AM – 9:00 PM", status: "Active",
    seats: "Yes", wifi: "Medium", crowd: "Medium", noise: "Moderate",
    description: "Double-height study hall shared by all engineering departments. Group tables up front and silent carrels along the back wall.",
    amenities: ["Wi-Fi", "Power outlets", "Lockers"],
    imageUrls: ["/assets/home/3c32d.png"], ratingTarget: 4.5, reviewsTarget: 189,
    curated: [
      { author: "Kasun Jayasuriya", rating: 3, text: "Gets noisy in the afternoons when classes end. Bring headphones.", status: "Visible", daysAgo: 2 },
    ],
    universityName: "University of Colombo",
  },
  {
    key: "peradeniya-main-library", name: "Peradeniya Main Library", building: "Main Library · Ground & 1st Floor", faculty: "Central Library", department: "Library Services", staffMonitored: true,
    address: "University of Peradeniya — Main Library", hours: "7:00 AM – 11:00 PM", status: "Active",
    seats: "Yes", wifi: "Strong", crowd: "Low", noise: "Quiet",
    description: "The university's largest study space across two floors — a silent reading room upstairs and a flexible group floor downstairs.",
    amenities: ["Wi-Fi", "Power outlets", "Reading rooms"],
    imageUrls: ["/assets/results/838a8.png"], ratingTarget: 4.8, reviewsTarget: 342,
    curated: [
      { author: "Nimasha Fernando", rating: 5, text: "Best lighting and the most seats I have found. The upper floor is extra peaceful.", status: "Visible", daysAgo: 7 },
    ],
    universityName: "University of Peradeniya",
  },
  {
    key: "sjp-learning-commons", name: "Sri Jayewardenepura Learning Commons", building: "Learning Commons · Level 3", faculty: "Central Library", department: "Learning Commons", staffMonitored: false,
    address: "University of Sri Jayewardenepura — Learning Commons", hours: "8:00 AM – 8:00 PM", status: "Active",
    seats: "Limited", wifi: "Medium", crowd: "Medium", noise: "Moderate",
    description: "Flexible lounge-style commons above the library with soft seating and whiteboard walls. Suited to group work.",
    amenities: ["Wi-Fi", "Power outlets", "Group rooms"],
    imageUrls: ["/assets/home/296f7.png"], ratingTarget: 4.2, reviewsTarget: 98,
    curated: [
      { author: "Maleesha De Silva", rating: 1, text: "Lost an hour to a booking system that never opened. Very frustrating.", status: "Hidden", daysAgo: 4 },
    ],
    universityName: "University of Sri Jayewardenepura",
  },
  {
    key: "ruhuna-science-reading-room", name: "Ruhuna Science Faculty Reading Room", building: "Science Faculty · 2nd Floor", faculty: "Faculty of Science", department: "Shared science space", staffMonitored: false,
    address: "University of Ruhuna — Science Faculty", hours: "8:00 AM – 8:00 PM", status: "Active",
    seats: "Limited", wifi: "Medium", crowd: "High", noise: "Moderate",
    description: "Compact reading room for science undergraduates and postgraduates. Quietest after classes end at 5 PM.",
    amenities: ["Wi-Fi", "Reference shelves"],
    imageUrls: ["/assets/home/0992e.png"], ratingTarget: 4.0, reviewsTarget: 87,
    curated: [],
    universityName: "University of Ruhuna",
  },
  {
    key: "jaffna-engineering-reading-area", name: "Jaffna Engineering Building Reading Area", building: "Engineering Building · Ground Floor", faculty: "Faculty of Engineering", department: "Shared engineering space", staffMonitored: false,
    address: "University of Jaffna — Engineering Building", hours: "Closed for refurbishment", status: "Inactive",
    seats: "No", wifi: "Weak", crowd: "High", noise: "Loud",
    description: "Small open reading area near the engineering faculty office. Currently listed inactive pending refurbishment.",
    amenities: ["Projector corner"],
    imageUrls: ["/assets/home/64a28.png"], ratingTarget: 3.8, reviewsTarget: 45,
    curated: [
      { author: "Tharushi Wickramasinghe", rating: 2, text: "Wi-Fi drops every few minutes and there are never enough power outlets.", status: "Visible", daysAgo: 5 },
    ],
    universityName: "University of Jaffna",
  },
  {
    key: "moratuwa-it-computer-labs", name: "Moratuwa IT Computer Labs", building: "IT Faculty · Lab Building", faculty: "Faculty of Information Technology", department: "Department of Information Technology", staffMonitored: true,
    address: "University of Moratuwa — IT Faculty", hours: "8:00 AM – 10:00 PM", status: "Active",
    seats: "Yes", wifi: "Strong", crowd: "Low", noise: "Quiet",
    description: "Two supervised computer labs with 120 workstations, open to all undergraduates outside lecture hours.",
    amenities: ["Wi-Fi", "Power outlets", "Computers", "Print station"],
    imageUrls: ["/assets/home/26beb.png"], ratingTarget: 4.7, reviewsTarget: 156,
    curated: [
      { author: "Dinuka Ramanayake", rating: 5, text: "Computers are fast and there is always a free seat after 6 pm.", status: "Visible", daysAgo: 1 },
    ],
    universityName: "University of Moratuwa",
  },
  {
    key: "colombo-library-north-wing", name: "Colombo Main Library North Wing", building: "Main Library · North Wing", faculty: "Central Library", department: "Library Services", staffMonitored: true,
    address: "University of Colombo — Main Library", hours: "8:00 AM – 9:00 PM", status: "Active",
    seats: "Yes", wifi: "Medium", crowd: "Low", noise: "Quiet",
    description: "North reading wing of the main library, focused on postgraduate study. Silent desks and the thesis collection.",
    amenities: ["Wi-Fi", "Power outlets", "Thesis collection"],
    imageUrls: ["/assets/saved/26beb.png"], ratingTarget: 4.4, reviewsTarget: 121,
    curated: [
      { author: "Anika Senanayake", rating: 4, text: "Spacious and calm, but outlets are limited near the reading tables.", status: "Visible", daysAgo: 6 },
    ],
    universityName: "University of Colombo",
  },
];

async function main() {
  console.log("Seeding database…");

  // Clear in dependency order
  await db.delete(savedPlaces);
  await db.delete(reviewVotes);
  await db.delete(reviews);
  await db.delete(locationHours);
  await db.delete(otpCodes);
  await db.delete(reportOptions);
  await db.delete(registrationRequests);
  await db.delete(locations);
  await db.delete(amenities);
  await db.delete(students);
  await db.delete(universityAdmins);
  await db.delete(superAdmins);
  await db.delete(universities);

  // ── Users ──────────────────────────────────────────────────────────────────
  const [moratuwa, colombo, peradeniya, sjp, ruhuna, jaffna] = await db
    .insert(universities)
    .values([
      { name: "University of Moratuwa", status: "Active" },
      { name: "University of Colombo", status: "Active" },
      { name: "University of Peradeniya", status: "Active" },
      { name: "University of Sri Jayewardenepura", status: "Active" },
      { name: "University of Ruhuna", status: "Active" },
      { name: "University of Jaffna", status: "Inactive" },
    ])
    .returning();
  const uniByName = new Map([
    [moratuwa.name, moratuwa],
    [colombo.name, colombo],
    [peradeniya.name, peradeniya],
    [sjp.name, sjp],
    [ruhuna.name, ruhuna],
    [jaffna.name, jaffna],
  ]);

  const superAdminHash = await hashPassword(SUPER_ADMIN_PASSWORD);
  const [superAdmin] = await db
    .insert(superAdmins)
    .values({
      email: "superadmin@spotwise.lk",
      name: "Super Admin",
      passwordHash: superAdminHash,
      address: "Katubedda, Moratuwa",
      profileImg: initialsAvatar("Super Admin", 4),
    })
    .returning();

  const adminHash = await hashPassword(ADMIN_PASSWORD);
  const [amal, kavindi, ruwan, dilani, saman] = await db
    .insert(universityAdmins)
    .values([
      { email: "amal.perera@uom.lk", name: "Amal Perera", title: "Dr.", passwordHash: adminHash, universityId: moratuwa.id, address: "Katubedda, Moratuwa", profileImg: initialsAvatar("Amal Perera", 0) },
      { email: "kavindi.silva@cmb.ac.lk", name: "Kavindi Silva", title: "Dr.", passwordHash: adminHash, universityId: colombo.id, address: "Colombo 03", profileImg: initialsAvatar("Kavindi Silva", 1) },
      { email: "ruwan.fernando@pdn.ac.lk", name: "Ruwan Fernando", title: "Prof.", passwordHash: adminHash, universityId: peradeniya.id, address: "Peradeniya, Kandy", profileImg: initialsAvatar("Ruwan Fernando", 2) },
      { email: "dilani.jayasuriya@sjp.ac.lk", name: "Dilani Jayasuriya", title: "Ms.", passwordHash: adminHash, universityId: sjp.id, status: "Inactive", address: "Nugegoda", profileImg: initialsAvatar("Dilani Jayasuriya", 3) },
      { email: "saman.rathnayake@ruh.ac.lk", name: "Saman Rathnayake", title: "Dr.", passwordHash: adminHash, universityId: ruhuna.id, address: "Matara", profileImg: initialsAvatar("Saman Rathnayake", 4) },
    ])
    .returning();
  const superAdminCreator = { createdBySuperAdminId: superAdmin.id };
  const adminByUni: Record<string, Record<string, string>> = {
    [moratuwa.id]: { createdByUniversityAdminId: amal.id },
    [colombo.id]: { createdByUniversityAdminId: kavindi.id },
    [peradeniya.id]: { createdByUniversityAdminId: ruwan.id },
    [sjp.id]: { createdByUniversityAdminId: dilani.id },
    [ruhuna.id]: { createdByUniversityAdminId: saman.id },
    [jaffna.id]: superAdminCreator,
  };

  // Mock author students (their reviews populate the catalog)
  const studentHash = await hashPassword(STUDENT_PASSWORD);
  const authorUsers = await db
    .insert(students)
    .values([
      // Primary demo student, mirrors the frontend profile mock
      { email: "mohamed.25@uom.lk", name: "Mohamed", passwordHash: studentHash,  universityId: moratuwa.id, faculty: "Faculty of Information Technology", address: "Molpe Road, Katubedda", studyPreferences: { studyStyle: "Quiet", noiseLevel: "Low", studyType: "Individual" }, amenities: ["Wi-Fi", "Power outlet"], profileImg: initialsAvatar("Mohamed", 0) },
      { email: "sahan.perera@uom.lk", name: "Sahan Perera", passwordHash: studentHash,  universityId: moratuwa.id, faculty: "Faculty of Information Technology", address: "Katubedda, Moratuwa", studyPreferences: { studyStyle: "Quiet", noiseLevel: "Low", studyType: "Individual" }, amenities: ["Wi-Fi"], profileImg: initialsAvatar("Sahan Perera", 1) },
      { email: "nimasha.fernando@uom.lk", name: "Nimasha Fernando", passwordHash: studentHash,  universityId: peradeniya.id, faculty: "Faculty of Agriculture", address: "Peradeniya, Kandy", studyPreferences: { studyStyle: "Social", noiseLevel: "Medium", studyType: "Group" }, amenities: ["Wi-Fi", "Power outlet", "Cafeteria"], profileImg: initialsAvatar("Nimasha Fernando", 2) },
      { email: "kasun.jayasuriya@cmb.ac.lk", name: "Kasun Jayasuriya", passwordHash: studentHash,  universityId: colombo.id, faculty: "Faculty of Engineering", address: "Colombo 05", studyPreferences: { studyStyle: "Focused", noiseLevel: "Medium", studyType: "Hybrid" }, amenities: ["Wi-Fi"], profileImg: initialsAvatar("Kasun Jayasuriya", 3) },
      { email: "dinuka.ramanayake@uom.lk", name: "Dinuka Ramanayake", passwordHash: studentHash,  universityId: moratuwa.id, faculty: "Faculty of Engineering", address: "Katubedda, Moratuwa", studyPreferences: { studyStyle: "Focused", noiseLevel: "Low", studyType: "Individual" }, amenities: ["Wi-Fi", "Power outlet"], profileImg: initialsAvatar("Dinuka Ramanayake", 5) },
      { email: "maleesha.desilva@sjp.ac.lk", name: "Maleesha De Silva", passwordHash: studentHash,  universityId: sjp.id, faculty: "Faculty of Engineering", address: "Nugegoda", studyPreferences: { studyStyle: "Social", noiseLevel: "High", studyType: "Group" }, amenities: ["Power outlet"], profileImg: initialsAvatar("Maleesha De Silva", 6) },
      { email: "anika.senanayake@cmb.ac.lk", name: "Anika Senanayake", passwordHash: studentHash,  universityId: colombo.id, faculty: "Faculty of Law", address: "Colombo 07", studyPreferences: { studyStyle: "Quiet", noiseLevel: "Low", studyType: "Individual" }, amenities: ["Wi-Fi", "Printer"], profileImg: initialsAvatar("Anika Senanayake", 7) },
      { email: "tharushi.wickramasinghe@jfn.ac.lk", name: "Tharushi Wickramasinghe", passwordHash: studentHash,  universityId: jaffna.id, faculty: "Faculty of Engineering", address: "Jaffna", studyPreferences: { studyStyle: "Quiet", noiseLevel: "Low", studyType: "Hybrid" }, amenities: ["Wi-Fi"], profileImg: initialsAvatar("Tharushi Wickramasinghe", 1) },
      { email: "ishara.fernando@rjt.ac.lk", name: "Ishara Fernando", passwordHash: studentHash,  universityId: moratuwa.id, faculty: "Faculty of Engineering", address: "Katubedda, Moratuwa", studyPreferences: { studyStyle: "Focused", noiseLevel: "Medium", studyType: "Group" }, amenities: ["Wi-Fi", "Power outlet"], profileImg: initialsAvatar("Ishara Fernando", 2) },
      { email: "roshan.mendis@vvt.lk", name: "Roshan Mendis", passwordHash: studentHash,  universityId: moratuwa.id, faculty: "Faculty of Architecture", address: "Colombo 13", studyPreferences: { studyStyle: "Social", noiseLevel: "Medium", studyType: "Hybrid" }, amenities: ["Wi-Fi", "Parking"], profileImg: initialsAvatar("Roshan Mendis", 3) },
    ])
    .returning();
  const [student] = authorUsers;
  const authorIds = authorUsers.map((u) => u.id);

  // ── Locations: 20 catalog spots (UoM) + 8 platform-wide admin locations ──
  const seededLocationIds: Record<string, string> = {};
  const insertedReviews: Array<{ id: string; studentId: string }> = [];

  const insertLocation = async (
    spec: Omit<SeedLocation, "ratingTarget" | "reviewsTarget" | "curated">
  ) => {
    const [row] = await db.insert(locations).values(spec).returning();
    return row.id;
  };

  let imageCursor = 0;
  const catalogRows = CATALOG.map((spot, index) => {
    const status = CATALOG_STATUS[index];
    const firstImageIndex = imageCursor % IMAGE_POOL.length;
    imageCursor += 1;
    return {
      spec: {
        name: spot.name,
        building: spot.address.split(" · ")[0] ?? spot.address,
        faculty: CATALOG_FACULTY[spot.key] ?? null,
        department: CATALOG_DEPARTMENT[spot.key] ?? null,
        staffMonitored: false,
        address: spot.address,
        hours: spot.hours,
        status: "Active" as const,
        seats: status.seats,
        wifi: status.wifi,
        crowd: status.crowd,
        noise: noiseFor(status.crowd),
        lastReportedBy: authorIds[index % authorIds.length],
        lastReportedAt: new Date(Date.now() - (1 + Math.floor(mulberry32(0xbeef + index)() * 29)) * 86_400_000),
        description: spot.description,
        amenities: spot.amenities,
        imageUrls:
          IMAGE_OVERRIDES[spot.key] ??
          Array.from({ length: 4 }, (_, offset) => IMAGE_POOL[(firstImageIndex + offset) % IMAGE_POOL.length]),
        ...{ createdByUniversityAdminId: amal.id },
        universityId: moratuwa.id,
      },
      lookupKey: spot.key,
      ratingTarget: spot.rating,
      reviewsTarget: spot.reviews,
      curated: CATALOG_CURATED[spot.key] ?? [],
    };
  });

  const adminRows = ADMIN_LOCATIONS.map((loc, index) => {
    const university = uniByName.get(loc.universityName)!;
    const { universityName, ratingTarget, reviewsTarget, curated, key, ...rest } = loc;
    return {
      spec: {
        ...rest,
        ...adminByUni[university.id],
        universityId: university.id,
        lastReportedBy: authorIds[index % authorIds.length],
        lastReportedAt: new Date(Date.now() - (1 + Math.floor(mulberry32(0xf00d0000 + index)() * 29)) * 86_400_000),
      },
      lookupKey: key,
      ratingTarget,
      reviewsTarget,
      curated,
    };
  });

  const allLocationRows = [...catalogRows, ...adminRows];
  console.log(`Inserting ${allLocationRows.length} locations with reviews…`);

  for (const [index, row] of allLocationRows.entries()) {
    const locationId = await insertLocation(row.spec);
    if (row.lookupKey) seededLocationIds[row.lookupKey] = locationId;
    const rng = mulberry32(0xc0ffee + index);
    const reviewRows = buildReviewRows(
      locationId,
      authorIds,
      { ...row.spec, ratingTarget: row.ratingTarget, reviewsTarget: row.reviewsTarget, curated: row.curated },
      rng
    );
    // Insert in batches to stay well below driver parameter limits.
    for (let i = 0; i < reviewRows.length; i += 500) {
      const inserted = await db
        .insert(reviews)
        .values(reviewRows.slice(i, i + 500))
        .returning({ id: reviews.id, studentId: reviews.studentId });
      insertedReviews.push(...inserted);
    }
  }

  // ── "Helpful" votes on reviews: each non-author student votes on ~15% ───────
  // Stored as an array of student ids per review row.
  // Seed a latest report comment on the demo spot so the student spot detail
  // page shows an example note above the "Report Current Status" button.
  if (seededLocationIds["uom-library"]) {
    await db
      .update(locations)
      .set({ reportComment: "Quiet in the mornings, busy after 5 PM." })
      .where(eq(locations.id, seededLocationIds["uom-library"]));
  }

  const voteRng = mulberry32(0xfeedbeef);
  const voterIdsByReview = new Map<string, string[]>();
  for (const review of insertedReviews) {
    const voters: string[] = [];
    for (const voterId of authorIds) {
      if (voterId === review.studentId) continue;
      if (voteRng() < 0.15) {
        voters.push(voterId);
      }
    }
    if (voters.length > 0) {
      voterIdsByReview.set(review.id, voters);
    }
  }
  console.log(`Casting ${[...voterIdsByReview.values()].reduce((n, v) => n + v.length, 0)} helpful votes…`);
  const voteRows = [...voterIdsByReview.entries()].map(([reviewId, voterIds]) => ({ reviewId, voterIds }));
  for (let i = 0; i < voteRows.length; i += 500) {
    await db.insert(reviewVotes).values(voteRows.slice(i, i + 500));
  }

  // ── Amenities catalog (master list; departments' choices are validated) ──
  const amenityLabels = new Set<string>();
  for (const amenitiesList of [
    ...CATALOG.map((s) => s.amenities),
    ...ADMIN_LOCATIONS.map((l) => l.amenities),
    ...authorUsers.map((u) => u.amenities),
  ]) {
    for (const label of amenitiesList) amenityLabels.add(label);
  }
  const amenityList = [...amenityLabels].sort((a, b) => a.localeCompare(b));
  await db.insert(amenities).values(
    amenityList.map((label, order) => ({ label, active: true, order }))
  );

  // ── Report options (backs /university-admin/settings/options) ───────────────
  // Only the four choice lists shown on the student status-report form.
  const optionSeed: Array<[typeof reportOptions.$inferInsert.category, string]> = [
    ["wifi", "Strong"], ["wifi", "Medium"], ["wifi", "Weak"],
    ["noise", "Quiet"], ["noise", "Moderate"], ["noise", "Loud"],
    ["crowd", "Low"], ["crowd", "Medium"], ["crowd", "High"],
    ["seats", "Yes"], ["seats", "Limited"], ["seats", "No"],
  ];
  const perCategoryOrder = new Map<string, number>();
  await db.insert(reportOptions).values(
    optionSeed.map(([category, label]) => {
      const order = perCategoryOrder.get(category) ?? 0;
      perCategoryOrder.set(category, order + 1);
      return { category, label, active: true, order };
    })
  );

  // ── Opening hours per weekday (0 = Sunday … 6 = Saturday) ──────────────────
  const HOURS_BY_SLUG: Record<string, { open: string; close: string; peak?: [string, string]; closed?: boolean }> = {
    "uom-library": { open: "07:30", close: "22:00", peak: ["18:00", "20:00"] },
    "uom-library-discussion": { open: "07:30", close: "22:00" },
    "uom-library-reading-area": { open: "07:30", close: "22:00" },
    "uom-library-reference-area": { open: "07:30", close: "22:00" },
    "faculty-architecture": { open: "08:00", close: "23:00" },
    "faculty-engineering": { open: "08:00", close: "20:00" },
    "faculty-it": { open: "08:00", close: "20:00" },
    "civil-student-study-room": { open: "08:00", close: "18:00" },
    "civil-graduate-computer-room": { open: "08:00", close: "20:00" },
    "civil-research-centre": { open: "08:00", close: "18:00" },
    "umcsawm-study-area": { open: "08:00", close: "18:00" },
    "tmle-lobby": { open: "08:00", close: "18:00" },
    "tmle-computer-lab": { open: "08:00", close: "18:00" },
    "rs-gis-laboratory": { open: "08:00", close: "18:00" },
    "oceanography-dry-lab": { open: "08:00", close: "18:00" },
    "oceanography-wet-lab": { open: "08:00", close: "18:00" },
    "materials-science-labs": { open: "08:00", close: "18:00" },
    "biomedical-engineering-lab": { open: "08:00", close: "18:00" },
    "bionics-laboratory": { open: "08:00", close: "18:00" },
    "motion-analysis-lab": { open: "08:00", close: "18:00" },
    "central-library-study-zone": { open: "08:00", close: "22:00", peak: ["18:00", "20:00"] },
    "engineering-block-study-hall": { open: "08:00", close: "21:00" },
    "peradeniya-main-library": { open: "07:00", close: "23:00", peak: ["19:00", "21:00"] },
    "sjp-learning-commons": { open: "08:00", close: "20:00" },
    "ruhuna-science-reading-room": { open: "08:00", close: "20:00" },
    "jaffna-engineering-reading-area": { open: "00:00", close: "00:00", closed: true },
    "moratuwa-it-computer-labs": { open: "08:00", close: "22:00", peak: ["18:00", "20:00"] },
    "colombo-library-north-wing": { open: "08:00", close: "21:00" },
  };
  const hoursRows = Object.entries(HOURS_BY_SLUG).flatMap(([slug, hours]) => {
    const locationId = seededLocationIds[slug];
    if (!locationId) return [];
    // Every open row gets a peak window: the location's configured peak if any,
    // otherwise the lunch rush (12:00–14:00). Closed rows have no peak.
    const peak = hours.closed ? undefined : (hours.peak ?? (["12:00", "14:00"] as [string, string]));
    return Array.from({ length: 7 }, (_, weekday) => ({
      locationId,
      weekday,
      isClosed: hours.closed ?? false,
      openTime: hours.open,
      closeTime: hours.close,
      peakStart: peak?.[0] ?? null,
      peakEnd: peak?.[1] ?? null,
    }));
  });
  for (let i = 0; i < hoursRows.length; i += 500) {
    await db.insert(locationHours).values(hoursRows.slice(i, i + 500));
  }

  // ── OTP code history (all expired; no usable code is seeded) ───────────────
  const now = Date.now();
  const daysAgo = (days: number, hours = 0) => new Date(now - days * DAY_MS - hours * 60 * 60 * 1000);
  const demoOtpHash = await hashPassword("123456");
  await db.insert(otpCodes).values([
    {
      email: "mohamed.25@uom.lk",
      codeHash: demoOtpHash,
      purpose: "login",
      attempts: 0,
      expiresAt: daysAgo(3, 6),
      consumedAt: daysAgo(3, 6),
      createdAt: daysAgo(3, 6),
    },
    {
      email: "mohamed.25@uom.lk",
      codeHash: demoOtpHash,
      purpose: "login",
      attempts: 1,
      expiresAt: daysAgo(10),
      consumedAt: daysAgo(10),
      createdAt: daysAgo(10),
    },
    {
      email: "sahan.perera@uom.lk",
      codeHash: demoOtpHash,
      purpose: "login",
      attempts: 0,
      expiresAt: daysAgo(14),
      createdAt: daysAgo(14),
    },
    {
      email: "ishara.fernando@rjt.ac.lk",
      codeHash: demoOtpHash,
      purpose: "login",
      attempts: 3,
      expiresAt: daysAgo(21),
      createdAt: daysAgo(21),
    },
  ]);

  // ── Saved places (student defaults from the frontend catalog) ──────────────
  await db.insert(savedPlaces).values([
    { studentId: student.id, locationId: seededLocationIds["faculty-it"] },
    { studentId: student.id, locationId: seededLocationIds["faculty-engineering"] },
  ]);



  // ── Registration requests (super-admin mock) ───────────────────────────────
  await db.insert(registrationRequests).values([
    {
      title: "Dr",
      name: "Nuwan Silva",
      university: "University of Kelaniya",
      email: "nuwan.silva@kln.ac.lk",
      note: "We have two campuses and roughly 18,000 students. Two computer labs in the new library wing need registered admin access from January.",
      status: "Pending",
    },
    {
      title: "Dr",
      name: "Dulani Fernando",
      university: "University of Rajarata",
      email: "dulani.fernando@rjt.ac.lk",
      note: "Small campus library with about 120 seats. We would like the facilities office team to have admin access for day-to-day space management.",
      status: "Pending",
    },
    {
      title: "Dr",
      name: "Priyanka Abeysekara",
      university: "University of Sabaragamuwa",
      email: "priyanka.abeysekara@sab.ac.lk",
      note: "Rolling out to the Faculty of Computing and ICT first. Affiliation letter was verified by the registrar.",
      status: "Approved",
      decidedAt: new Date(),
    },
    {
      title: "Dr",
      name: "Roshan Mendis",
      university: "University of Vocational Technology",
      email: "roshan.mendis@vvt.lk",
      note: "I can provide the faculty affiliation letter if any documentation is still missing.",
      status: "Rejected",
      decidedAt: new Date(),
    },
  ]);

  const [{ value: reviewCount }] = await db.select({ value: count() }).from(reviews);

  console.log("Seed completed:");
  console.log(`  Universities: 6 (${[moratuwa, colombo, peradeniya, sjp, ruhuna, jaffna].length})`);
  console.log(`  Locations:    ${allLocationRows.length} (20 catalog + 8 platform-wide)`);
  console.log(`  Reviews:      ${reviewCount}`);
  console.log(`  Options:      ${optionSeed.length}`);
  console.log(`  Hours rows:   ${hoursRows.length}`);
  console.log(`  Helpful votes: ${voteRows.length}`);
  console.log(`  OTP codes:     4 (all expired/consumed)`);
  console.log(`  Super admin:  superadmin@spotwise.lk / ${SUPER_ADMIN_PASSWORD}`);
  console.log(`  University admins: e.g. amal.perera@uom.lk / ${ADMIN_PASSWORD}`);
  console.log(`  Student:      mohamed.25@uom.lk / ${STUDENT_PASSWORD}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});