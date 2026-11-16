"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { SuperAdminNav } from "@/components/navigation/super-admin-nav";

export const dynamic = "force-dynamic";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const role = useAuthStore((s) => s.role);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const isLogin = pathname === "/super-admin/login";

  useEffect(() => {
    if (hasHydrated && !isLogin && role !== "super-admin") {
      router.replace("/super-admin/login");
    }
  }, [hasHydrated, role, router, isLogin]);

  if (isLogin) {
    return <div className="min-h-screen bg-[#E2E8F0]">{children}</div>;
  }

  if (!hasHydrated || role !== "super-admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#E2E8F0] relative">
      <SuperAdminNav />
      <main className="lg:pl-[260px]">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
