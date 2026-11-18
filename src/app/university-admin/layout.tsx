"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { AdminStudentNav } from "@/components/navigation/admin-student-nav";
import { RouteTransition } from "@/components/shared/route-transition";
import { useUniversityAdminThemeStore } from "@/stores/university-admin-theme-store";

export const dynamic = "force-dynamic";

export default function UniversityAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const role = useAuthStore((s) => s.role);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isDark = useUniversityAdminThemeStore((state) => state.isDark);

  const isLogin = pathname === "/university-admin/login";
  const isRegister = pathname === "/university-admin/register";

  // Login and registration are public; everything else requires the university-admin role.
  const isPublic = isLogin || isRegister;

  useEffect(() => {
    if (hasHydrated && !isPublic && role !== "university-admin") {
      router.replace("/university-admin/login");
    }
  }, [hasHydrated, role, router, isPublic]);

  // Wait until auth store is hydrated
  if (!hasHydrated) {
    return null;
  }

  // Hold the redirect above; render nothing until the role is correct
  if (!isPublic && role !== "university-admin") {
    return null;
  }

  // Pages that should not show the bottom navigation (login, register, and Add Location)
  const isLocationDetail = pathname.startsWith("/university-admin/locations/") && pathname !== "/university-admin/locations" && pathname !== "/university-admin/locations/new" && pathname !== "/university-admin/locations/preview";
  if (isLogin || isRegister || pathname === "/university-admin/locations/new" || pathname === "/university-admin/locations/preview" || isLocationDetail) {
    return <div className="mx-auto min-h-screen w-full md:max-w-[412px] bg-white"><RouteTransition>{children}</RouteTransition></div>;
  }

  // All other admin pages get the full shell with navigation
  return (
    <div
      data-admin-theme={isDark ? "dark" : "light"}
      className="admin-shell mx-auto min-h-screen w-full md:max-w-[412px] bg-[#E2E8F0] pb-[90px]"
    >
      <RouteTransition>{children}</RouteTransition>
      <AdminStudentNav />
    </div>
  );
}
