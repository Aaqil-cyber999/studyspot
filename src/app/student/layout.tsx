"use client";

import { usePathname } from "next/navigation";
import { StudentBottomNav } from "@/components/navigation/student-bottom-nav";

export const dynamic = "force-dynamic";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav =
    pathname === "/student/login" ||
    pathname === "/student/info" ||
    pathname === "/student/verify" ||
    pathname === "/student/select-university" ||
    pathname.startsWith("/student/results");

  // The profile and saved pages handle the fixed nav clearance themselves so
  // they can stay exactly one viewport tall instead of always scrolling 90px.
  const needsNavClearance =
    !hideNav && pathname !== "/student/profile" && pathname !== "/student/saved";

  return (
    <div
      className={`mx-auto min-h-screen w-full max-w-[412px] bg-white ${
        needsNavClearance ? "pb-[90px]" : ""
      }`}
    >
      {children}
      {!hideNav && <StudentBottomNav />}
    </div>
  );
}