import type { AnyAccount } from "../db/queries.js";

/** Shape returned to clients — never includes passwordHash. */
export function publicUser(account: AnyAccount, universityName?: string | null) {
  const isStudent = account.role === "student";
  return {
    id: account.id,
    email: account.email,
    name: account.name,
    role: account.role,
    status: account.status,
    title: account.role === "university-admin" ? account.title : null,
    universityId: "universityId" in account ? account.universityId : null,
    universityName: universityName ?? null,
    faculty: isStudent && "faculty" in account ? account.faculty : null,
    address: "address" in account ? account.address : null,
    profileImg: "profileImg" in account ? account.profileImg : null,
    studyPreferences: isStudent ? (account.studyPreferences ?? null) : null,
    amenities: isStudent ? account.amenities : [],
    // Flat convenience fields for clients that prefer them
    studyStyle: isStudent && account.studyPreferences?.studyStyle ? account.studyPreferences.studyStyle : null,
    noiseLevel: isStudent && account.studyPreferences?.noiseLevel ? account.studyPreferences.noiseLevel : null,
    studyType: isStudent && account.studyPreferences?.studyType ? account.studyPreferences.studyType : null,
    createdAt: account.createdAt,
  };
}
