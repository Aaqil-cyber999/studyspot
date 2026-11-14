"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/super-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/super-admin/universities", label: "Universities", icon: Building2 },
  { href: "/super-admin/admins", label: "University admins", icon: Users },
  { href: "/super-admin/requests", label: "Registration requests", icon: ClipboardList },
  { href: "/super-admin/locations", label: "Study locations", icon: MapPin },
  { href: "/super-admin/comments", label: "Comments & ratings", icon: MessageSquare },
];

export function SuperAdminSidebar({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = () => {
    setSigningOut(true);
    router.push("/super-admin/login");
    router.refresh();
  };

  return (
    <aside className="flex h-full w-[272px] shrink-0 flex-col bg-[#111827] text-white">
      <div className="flex h-[84px] items-center justify-between border-b border-white/10 px-6">
        <Link href="/super-admin/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-orange-500/20">
            <ShieldCheck className="size-5" />
          </span>
          <span>
            <span className="block text-[15px] font-semibold tracking-tight">SpotWise</span>
            <span className="block text-xs text-slate-400">Admin console</span>
          </span>
        </Link>
        <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden" aria-label="Close navigation">
          <X className="size-5" />
        </button>
      </div>

      <div className="px-5 pb-2 pt-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Workspace
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Admin navigation">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white shadow-md shadow-orange-950/20"
                  : "text-slate-300 hover:bg-white/[0.07] hover:text-white",
              )}
            >
              <Icon className="size-[18px] shrink-0" />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              <ChevronRight className={cn("size-4 opacity-0 transition-opacity", active && "opacity-70")} />
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link href="/super-admin/profile" onClick={onClose} className="mb-3 flex items-center gap-3 rounded-xl p-2 hover:bg-white/[0.07]">
          <span className="flex size-9 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">SA</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">Super Admin</span>
            <span className="block truncate text-xs text-slate-400">superadmin@spotwise.lk</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          disabled={signingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-white/[0.07] hover:text-white disabled:opacity-60"
        >
          <LogOut className="size-[17px]" />
          {signingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </aside>
  );
}

export { SuperAdminSidebar as Sidebar };
