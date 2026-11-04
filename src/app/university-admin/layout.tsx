"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminBottomNav } from "@/components/navigation/admin-bottom-nav";
import { useAuthStore } from "@/stores/auth-store";

export const dynamic = "force-dynamic";

const items = [
  { href: "/university-admin/dashboard", label: "Dashboard" },
  { href: "/university-admin/locations", label: "Locations" },
  { href: "/university-admin/comments", label: "Comments" },
  { href: "/university-admin/profile", label: "Profile" },
];

export default function UniversityAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const role = useAuthStore((s) => s.role);

  useEffect(() => {
    if (role !== "university-admin") {
      router.replace("/university-admin/login");
    }
  }, [role, router]);

  if (role !== "university-admin") {
    return null;
  }

  return (
    <div className="mx-auto min-h-screen w-[412px] bg-white pb-20">
      {children}
      <AdminBottomNav items={items} />
    </div>
  );
}