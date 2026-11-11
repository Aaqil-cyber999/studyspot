import { comments as studentComments, studyLocations } from "@/mocks/data/student";
import { studySpotCatalog } from "@/mocks/data/study-spots";
import type { Comment } from "@/types";

type AdminCategory = "Library" | "Labs" | "Study space";
type AdminNoise = "Quiet" | "Moderate" | "Loud";

const toAdminCategory = (category: string): AdminCategory => {
  if (category === "Library") return "Library";
  if (category.toLowerCase().includes("lab")) return "Labs";
  return "Study space";
};

const toAdminNoise = (crowd: "Low" | "Medium" | "High"): AdminNoise => {
  if (crowd === "Low") return "Quiet";
  if (crowd === "Medium") return "Moderate";
  return "Loud";
};

// The university-admin views reuse the same study spots students see, so both
// roles stay in sync: names, areas, hours, ratings, review counts and the live
// seats / Wi-Fi / crowd statuses all come from `studySpotCatalog`.
export const uaLocations = studySpotCatalog.map((spot, index) => {
  const [building = spot.area] = spot.area.split(" · ");
  const studentLocation = studyLocations[index];

  return {
    id: studentLocation?.id ?? `loc-${index + 1}`,
    name: spot.name,
    building,
    area: spot.area,
    hours: spot.hours,
    rating: spot.rating,
    reviews: spot.reviews,
    status: "Active" as const,
    seats: spot.seats,
    wifi: spot.wifi,
    crowd: spot.crowd,
    noise: toAdminNoise(spot.crowd),
    description: spot.description,
    category: toAdminCategory(spot.category),
    amenities: spot.amenities,
    imageUrls: spot.imageUrls,
    lastUpdated: spot.lastUpdated,
  };
});

const totalReviews = studySpotCatalog.reduce((sum, spot) => sum + spot.reviews, 0);
const averageRating =
  studySpotCatalog.reduce((sum, spot) => sum + spot.rating, 0) / studySpotCatalog.length;

export const uaDashboard = {
  university: "University of Moratuwa",
  locations: uaLocations.length,
  avgRating: Math.round(averageRating * 10) / 10,
  comments: totalReviews,
  seatsAvailable: studySpotCatalog.filter((spot) => spot.seats === "Yes").length,
};

// Student feedback reuses the student comment mocks, with the location name
// resolved from the shared catalog so it always matches the current spot name.
export const uaComments: Comment[] = studentComments.map((comment) => ({
  ...comment,
  locationName:
    uaLocations.find((location) => location.id === comment.locationId)?.name ??
    comment.locationName,
}));

export const uaProfile = {
  name: "University Admin",
  email: "admin@uom.lk",
  university: "University of Moratuwa",
};
