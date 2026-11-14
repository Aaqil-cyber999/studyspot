import { studyLocations, comments, studentProfile } from "@/mocks/data/student";
import { getCatalogSpotDetail, spotDetail } from "@/mocks/data/spot-detail";

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getStudyLocations() {
  return api.get("/locations");
}

export async function getComments() {
  return api.get("/comments");
}

export async function getStudentProfile() {
  await delay();
  return studentProfile;
}

export async function getSpotDetail(id: string) {
  await delay();
  if (id === spotDetail.slug) return spotDetail;

  const catalogSpotDetail = getCatalogSpotDetail(id);
  if (!catalogSpotDetail) {
    throw new Error(`Study spot not found: ${id}`);
  }

  return catalogSpotDetail;
}