import { studySpotCatalog } from "@/mocks/data/study-spots";
import type { StudyLocation, Comment } from "@/types";

export const amenityOptions = ["Wi-Fi", "Power outlet", "Cafeteria", "Printer", "Parking", "Elevator", "Accessible seating"] as const;

export const studentProfile = {
  name: "Mohamed",
  email: "mohamed.25@uom.lk",
  address: "Molpe Road, Katubedda",
  studyStyle: "Quiet",
  noiseLevel: "Low",
  studyType: "Individual",
  amenities: ["Wi-Fi", "Power outlet"],
};

export const studyLocations: StudyLocation[] = studySpotCatalog.map((spot, index) => {
  const [building, floor] = spot.area.split(" · ");

  return {
    id: `loc-${index + 1}`,
    name: spot.name,
    university: "University of Moratuwa",
    building,
    floor,
    hours: spot.hours,
    rating: spot.rating,
    reviews: spot.reviews,
    amenities: spot.amenities,
    saved: spot.slug === "uom-library" || spot.slug === "faculty-engineering",
  };
});

export const comments: Comment[] = [
  {
    id: "c-1",
    locationId: "loc-1",
    locationName: "Central Library Study Zone",
    author: "Mohamed",
    rating: 4.6,
    text: "Quiet and bright.",
    createdAt: "3 days ago",
  },
  {
    id: "c-2",
    locationId: "loc-3",
    locationName: "Engineering Block",
    author: "Mohamed",
    rating: 5.0,
    text: "Plenty of power outlets.",
    createdAt: "1 week ago",
  },
];
