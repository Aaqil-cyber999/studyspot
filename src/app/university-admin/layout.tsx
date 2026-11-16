"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { AdminStudentNav } from "@/components/navigation/admin-student-nav";
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

  // Redirect unauthenticated users to login (except when on login page itself)
  useEffect(() => {
    if (hasHydrated && !isLogin && role !== "university-admin") {
      router.replace("/university-admin/login");
    }
  }, [hasHydrated, role, router, isLogin]);

  // Wait until auth store is hydrated and role is correct
  if (!hasHydrated || role !== "university-admin") {
    return null;
  }

  // Pages that should not show the bottom navigation (login, register, and Add Location)
  const isLocationDetail = pathname.startsWith("/university-admin/locations/") && pathname !== "/university-admin/locations" && pathname !== "/university-admin/locations/new" && pathname !== "/university-admin/locations/preview";
  if (isLogin || isRegister || pathname === "/university-admin/locations/new" || pathname === "/university-admin/locations/preview" || isLocationDetail) {
    return <div className="mx-auto min-h-screen w-[412px] bg-white">{children}</div>;
  }

  // All other admin pages get the full shell with navigation
  return (
    <div
      data-admin-theme={isDark ? "dark" : "light"}
      className="admin-shell mx-auto min-h-screen w-[412px] bg-[#E2E8F0] pb-[90px]"
    >
      {children}
      <AdminStudentNav />
    </div>
  );
}
