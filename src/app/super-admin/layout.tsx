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

  const isLogin = pathname === "/super-admin/login";

  useEffect(() => {
    if (!isLogin && role !== "super-admin") {
      router.replace("/super-admin/login");
    }
  }, [role, router, isLogin]);

  if (isLogin) {
    return <div className="min-h-screen bg-[#fbfbfc]">{children}</div>;
  }

  if (role !== "super-admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fbfbfc] relative">
      <SuperAdminNav />
      <main
        className="px-6 pb-4 pt-0 lg:pl-[260px] lg:px-6 lg:pr-6 lg:overflow-y-auto min-h-screen"
      >
        {children}
      </main>
    </div>
  );
}
