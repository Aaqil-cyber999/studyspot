"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Sidebar } from "@/components/super-admin-sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const role = useAuthStore((s) => s.role);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLogin = pathname === "/super-admin/login";

  useEffect(() => {
    if (!isLoading && !isLogin && role !== "super-admin") {
      router.replace("/super-admin/login");
    }
  }, [isLoading, role, router, isLogin]);

  if (isLogin) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  if (isLoading || role !== "super-admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="fixed inset-y-0 left-0 z-50 hidden lg:flex">
        <Sidebar />
      </div>
      {sidebarOpen && (
        <button className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />
      )}
      <div className={cn("fixed inset-y-0 left-0 z-50 flex transition-transform lg:hidden", sidebarOpen ? "translate-x-0" : "-translate-x-full")}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      <main className="min-h-screen lg:pl-[272px]">
        <button type="button" onClick={() => setSidebarOpen(true)} className="fixed left-4 top-4 z-30 flex size-10 items-center justify-center rounded-xl bg-[#111827] text-white shadow-lg lg:hidden" aria-label="Open navigation">
          <Menu className="size-5" />
        </button>
        {children}
      </main>
    </div>
  );
}