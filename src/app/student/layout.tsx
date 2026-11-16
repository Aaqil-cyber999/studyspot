"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StudentBottomNav } from "@/components/navigation/student-bottom-nav";
import { useThemeStore } from "@/stores/theme-store";
import { useAuthStore } from "@/stores/auth-store";

export const dynamic = "force-dynamic";

const PUBLIC_PATHS = new Set(["/student/login", "/student/verify"]);

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isDark = useThemeStore((state) => state.isDark);
  const role = useAuthStore((s) => s.role);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const isPublic = PUBLIC_PATHS.has(pathname);

  useEffect(() => {
    if (hasHydrated && !isPublic && role !== "student") {
      router.replace("/student/login");
    }
  }, [hasHydrated, role, router, isPublic]);

  if (isPublic) {
    return <div className="min-h-screen bg-[#E2E8F0]">{children}</div>;
  }

  if (!hasHydrated || role !== "student") {
    return null;
  }

  const hideNav =
    pathname === "/student/info" ||
    pathname === "/student/select-university" ||
    pathname === "/student/rate" ||
    pathname === "/student/review" ||
    pathname === "/student/result" ||
    pathname.startsWith("/student/results");

  // The profile and saved pages handle the fixed nav clearance themselves so
  // they can stay exactly one viewport tall instead of always scrolling 90px.
  const needsNavClearance =
    !hideNav && pathname !== "/student/profile" && pathname !== "/student/saved";

  return (
    <div
      data-admin-theme={isDark ? "dark" : "light"}
      className={`student-shell mx-auto min-h-screen w-full max-w-[412px] bg-[#E2E8F0] ${
        needsNavClearance ? "pb-[90px]" : ""
      }`}
    >
      {children}
      {!hideNav && <StudentBottomNav />}
    </div>
  );
}
