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
  const isDark = useUniversityAdminThemeStore((state) => state.isDark);

  const isLogin = pathname === "/university-admin/login";

  useEffect(() => {
    if (!isLogin && role !== "university-admin") {
      router.replace("/university-admin/login");
    }
  }, [role, router, isLogin]);

  if (isLogin) {
    return <div className="mx-auto min-h-screen w-[412px] bg-white">{children}</div>;
  }

  if (role !== "university-admin") {
    return null;
  }

  return (
    <div data-admin-theme={isDark ? "dark" : "light"} className="admin-shell mx-auto min-h-screen w-[412px] bg-[#fbfbfc] pb-[90px]">
      {children}
      <AdminStudentNav />
    </div>
  );
}