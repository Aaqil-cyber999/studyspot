import { studyLocations, savedLocations, comments, studentProfile } from "@/mocks/data/student";

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getStudyLocations() {
  await delay();
  return studyLocations;
}

export async function getSavedLocations() {
  await delay();
  return savedLocations;
}

export async function getComments() {
  await delay();
  return comments;
}

export async function getStudentProfile() {
  await delay();
  return studentProfile;
}