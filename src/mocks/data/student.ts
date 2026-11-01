import type { StudyLocation, Comment } from "@/types";

export const studentProfile = {
  name: "XYZ Student",
  email: "xyz.25@uom.lk",
  address: "Molpe Road, Katubedda",
  studyStyle: "Quiet",
  noiseLevel: "Low",
  studyType: "Individual",
  amenities: ["Wi-Fi", "Power outlets"],
};

export const studyLocations: StudyLocation[] = [
  {
    id: "loc-1",
    name: "UoM Library — Basement Study Hall",
    university: "University of Moratuwa",
    building: "University Library",
    floor: "Basement floor",
    hours: "7:30 – 22:00 daily",
    rating: 4.8,
    reviews: 312,
    amenities: ["Wi-Fi", "Power outlets", "Silent zones"],
    saved: true,
  },
  {
    id: "loc-2",
    name: "Faculty of Architecture Studios",
    university: "University of Moratuwa",
    building: "Faculty of Architecture",
    floor: "Katubedda",
    hours: "Open late",
    rating: 4.7,
    reviews: 154,
    amenities: ["Design studios", "Power outlets", "Open late"],
  },
  {
    id: "loc-3",
    name: "Faculty of Engineering Halls",
    university: "University of Moratuwa",
    building: "Faculty of Engineering",
    floor: "Katubedda",
    hours: "Between lectures",
    rating: 4.5,
    reviews: 203,
    amenities: ["Wi-Fi", "Spacious seating", "Power outlets"],
    saved: true,
  },
  {
    id: "loc-4",
    name: "Faculty of IT Computer Labs",
    university: "University of Moratuwa",
    building: "Faculty of Information Technology",
    floor: "Katubedda",
    rating: 4.6,
    reviews: 176,
    amenities: ["Computers", "Wi-Fi", "Power outlets"],
  },
  {
    id: "loc-5",
    name: "UoM Library — Discussion Room",
    university: "University of Moratuwa",
    building: "University Library",
    floor: "1st floor",
    hours: "Seats 60",
    rating: 4.6,
    reviews: 98,
    amenities: ["Group study", "Wi-Fi", "Near photocopier"],
  },
  {
    id: "loc-6",
    name: "UoM Library · Basement Hall",
    university: "University of Moratuwa",
    building: "University Library",
    floor: "Basement floor",
    hours: "Till 22:00",
    rating: 4.9,
    reviews: 128,
    amenities: ["Wi-Fi", "Power", "AC"],
  },
];

export const savedLocations = studyLocations.filter((l) => l.saved);

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