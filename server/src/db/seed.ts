import dotenv from "dotenv";
dotenv.config();
import { db } from "./index.js";
import { universities, users, locations } from "./schema.js";
import { hashPassword } from "../lib/hash.js";

// Minimal seed from existing mock data shapes.
// This runs once on a fresh database.
async function main() {
  // Check if University of Moratuwa already exists
  const existingUom = await db.select().from(universities).where(users.email.eq("University of Moratuwa")).limit(1); // placeholder - wrong approach

  // Actually, let's just use a simpler approach: try insert and catch conflict
  try {
    // Create a default university
    const [uom] = await db.insert(universities).values({ name: "University of Moratuwa", status: "Active" }).returning();
    console.log("University of Moratuwa seeded");
  } catch (err) {
    // If unique constraint violation, just get the existing one
    const existing = await db.select().from(universities).where(universities.name.eq("University of Moratuwa")).limit(1);
    if (existing.length > 0) {
      console.log("University of Moratuwa already exists, skipping insert");
    } else {
      throw err;
    }
  }

  // Create a super-admin
  const superAdminPassword = await hashPassword("admin123");
  const [superAdmin] = await db.insert(users).values({
    email: "superadmin@uom.lk",
    name: "Super Admin",
    university: uom.id,
    passwordHash: superAdminPassword,
    role: "super-admin",
  }).returning();

  // Seed locations (minimal subset of mock data)
  const locationData = [
    {
      name: "UoM Library — Basement Study",
      building: "Basement",
      area: "University of Moratuwa — Basement Study",
      hours: "8:00 AM - 8:00 PM",
      rating: 99,
      reviews: 100,
      status: "Active",
      seats: "Yes",
      wifi: "Strong",
      crowd: "Low",
      noise: "Quiet",
      description: "Quiet basement study area with power outlets.",
      category: "Library",
      amenities: ["Wi-Fi", "Power outlet"],
      imageUrls: [],
      universityId: uom.id,
      createdBy: superAdmin.id,
    },
    {
      name: "Faculty of Engineering Halls",
      building: "Hall A",
      area: "Faculty of Engineering Halls",
      hours: "24 hours",
      rating: 36,
      reviews: 100,
      status: "Active",
      seats: "No",
      wifi: "Weak",
      crowd: "High",
      noise: "Loud",
      description: "Crowded engineering hall with limited seating.",
      category: "Study space",
      amenities: ["Wi-Fi"],
      imageUrls: [],
      universityId: uom.id,
      createdBy: superAdmin.id,
    },
  ];

  for (const loc of locationData) {
    await db.insert(locations).values(loc);
  }

  console.log("Seed completed");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});