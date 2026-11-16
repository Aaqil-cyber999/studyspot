import type { University, UniversityAdmin, RegistrationRequest, Comment } from "@/types";

export interface SaLocation {
  id: string;
  name: string;
  university: string;
  rating: number;
  reviews: number;
  status: "Active" | "Inactive";
}

export type SaComment = Comment & { status: "Visible" | "Hidden" };

export interface SaProfile {
  name: string;
  email: string;
}

export const universities: University[] = [
  { id: "u-1", name: "University of Moratuwa", admin: "Dr. Amal Perera", locations: 12, status: "Active" },
  { id: "u-2", name: "University of Colombo", admin: "Dr. Kavindi Silva", locations: 8, status: "Active" },
  { id: "u-3", name: "University of Peradeniya", admin: "Prof. Ruwan Fernando", locations: 15, status: "Active" },
  { id: "u-4", name: "University of Sri Jayewardenepura", admin: "Ms. Dilani Jayasuriya", locations: 10, status: "Active" },
  { id: "u-5", name: "University of Ruhuna", admin: "Dr. Saman Rathnayake", locations: 9, status: "Active" },
  { id: "u-6", name: "University of Jaffna", admin: "Dr. Meena Kanagasabai", locations: 4, status: "Inactive" },
];

export const universityAdmins: UniversityAdmin[] = [
  { id: "a-1", name: "Dr. Amal Perera", email: "amal.perera@uom.lk", university: "University of Moratuwa", status: "Active" },
  { id: "a-2", name: "Dr. Kavindi Silva", email: "kavindi.silva@cmb.ac.lk", university: "University of Colombo", status: "Active" },
  { id: "a-3", name: "Prof. Ruwan Fernando", email: "ruwan.fernando@pdn.ac.lk", university: "University of Peradeniya", status: "Active" },
  { id: "a-4", name: "Ms. Dilani Jayasuriya", email: "dilani.jayasuriya@sjp.ac.lk", university: "University of Sri Jayewardenepura", status: "Inactive" },
  { id: "a-5", name: "Dr. Saman Rathnayake", email: "saman.rathnayake@ruh.ac.lk", university: "University of Ruhuna", status: "Active" },
];

export const registrationRequests: RegistrationRequest[] = [
  {
    id: "r-1",
    title: "Dr",
    name: "Nuwan Silva",
    university: "University of Kelaniya",
    email: "nuwan.silva@kln.ac.lk",
    submittedAt: "2 days ago",
    status: "Pending",
    note: "We have two campuses and roughly 18,000 students. Two computer labs in the new library wing need registered admin access from January.",
  },
  {
    id: "r-2",
    title: "Dr",
    name: "Ishara Fernando",
    university: "University of Rajarata",
    email: "ishara.fernando@rjt.ac.lk",
    submittedAt: "5 days ago",
    status: "Pending",
    note: "Small campus library with about 120 seats. We would like the facilities office team to have admin access for day-to-day space management.",
  },
  {
    id: "r-3",
    title: "Dr",
    name: "Priyanka Abeysekara",
    university: "University of Sabaragamuwa",
    email: "priyanka.abeysekara@sab.ac.lk",
    submittedAt: "3 weeks ago",
    status: "Approved",
    note: "Rolling out to the Faculty of Computing and ICT first. Affiliation letter was verified by the registrar.",
  },
  {
    id: "r-4",
    title: "Dr",
    name: "Roshan Mendis",
    university: "University of Vocational Technology",
    email: "roshan.mendis@vvt.lk",
    submittedAt: "1 month ago",
    status: "Rejected",
    note: "I can provide the faculty affiliation letter if any documentation is still missing.",
  },
];

export const saLocations: SaLocation[] = [
  { id: "sa-loc-1", name: "Central Library Study Zone", university: "University of Moratuwa", rating: 4.6, reviews: 214, status: "Active" },
  { id: "sa-loc-2", name: "Engineering Block Study Hall", university: "University of Colombo", rating: 4.5, reviews: 189, status: "Active" },
  { id: "sa-loc-3", name: "Peradeniya Main Library", university: "University of Peradeniya", rating: 4.8, reviews: 342, status: "Active" },
  { id: "sa-loc-4", name: "Sri Jayewardenepura Learning Commons", university: "University of Sri Jayewardenepura", rating: 4.2, reviews: 98, status: "Active" },
  { id: "sa-loc-5", name: "Ruhuna Science Faculty Reading Room", university: "University of Ruhuna", rating: 4.0, reviews: 87, status: "Active" },
  { id: "sa-loc-6", name: "Jaffna Engineering Building Reading Area", university: "University of Jaffna", rating: 3.8, reviews: 45, status: "Inactive" },
  { id: "sa-loc-7", name: "Moratuwa IT Computer Labs", university: "University of Moratuwa", rating: 4.7, reviews: 156, status: "Active" },
  { id: "sa-loc-8", name: "Colombo Main Library North Wing", university: "University of Colombo", rating: 4.4, reviews: 121, status: "Active" },
];

export const saComments: SaComment[] = [
  { id: "sa-c1", locationId: "sa-loc-1", locationName: "Central Library Study Zone", author: "Sahan Perera", rating: 4.6, text: "Quiet and bright with plenty of open desks and strong Wi-Fi.", createdAt: "3 days ago", status: "Visible" },
  { id: "sa-c2", locationId: "sa-loc-3", locationName: "Peradeniya Main Library", author: "Nimasha Fernando", rating: 4.8, text: "Best lighting and the most seats I have found. The upper floor is extra peaceful.", createdAt: "1 week ago", status: "Visible" },
  { id: "sa-c3", locationId: "sa-loc-2", locationName: "Engineering Block Study Hall", author: "Kasun Jayasuriya", rating: 3.2, text: "Gets noisy in the afternoons when classes end. Bring headphones.", createdAt: "2 days ago", status: "Visible" },
  { id: "sa-c4", locationId: "sa-loc-6", locationName: "Jaffna Engineering Building Reading Area", author: "Tharushi Wickramasinghe", rating: 2.1, text: "Wi-Fi drops every few minutes and there are never enough power outlets.", createdAt: "5 days ago", status: "Visible" },
  { id: "sa-c5", locationId: "sa-loc-7", locationName: "Moratuwa IT Computer Labs", author: "Dinuka Ramanayake", rating: 4.9, text: "Computers are fast and there is always a free seat after 6 pm.", createdAt: "1 day ago", status: "Visible" },
  { id: "sa-c6", locationId: "sa-loc-4", locationName: "Sri Jayewardenepura Learning Commons", author: "Maleesha De Silva", rating: 1.4, text: "Lost an hour to a booking system that never opened. Very frustrating.", createdAt: "4 days ago", status: "Hidden" },
  { id: "sa-c7", locationId: "sa-loc-8", locationName: "Colombo Main Library North Wing", author: "Anika Senanayake", rating: 4.1, text: "Spacious and calm, but outlets are limited near the reading tables.", createdAt: "6 days ago", status: "Visible" },
];

export const saProfile: SaProfile = {
  name: "Super Admin",
  email: "superadmin@spotwise.lk",
};
