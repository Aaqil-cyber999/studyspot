"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, Layout, Building2, Users, Inbox, MapPin, MessageSquare, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { logout } from "@/services/auth";
import { useRef } from "react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/super-admin/dashboard", label: "Dashboard", icon: Layout },
  { href: "/super-admin/universities", label: "Universities", icon: Building2 },
  { href: "/super-admin/admins", label: "Admins", icon: Users },
  { href: "/super-admin/requests", label: "Requests", icon: Inbox },
  { href: "/super-admin/locations", label: "Locations", icon: MapPin },
  { href: "/super-admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/super-admin/profile", label: "Profile", icon: User },
];

export function SuperAdminNav() {
  const router = useRouter();
  const pathname = usePathname();
  const role = useAuthStore((s) => s.role);
  const signOut = useAuthStore((s) => s.signOut);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (role !== "super-admin") {
      router.replace("/super-admin/login");
    }
  }, [role, router]);

  // Escape closes the mobile drawer
  useEffect(() => {
    if (!drawerOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuOpen && profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuOpen]);

  async function handleSignOut() {
    try {
      await logout();
    } catch {
      // Sign out locally even if the server cookie could not be revoked.
    }
    signOut();
    setProfileMenuOpen(false);
    // Full document load — never keep a stale page after the session is gone.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/");
  }

  return (
    <>
      {/* Desktop left sidebar */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-[260px] lg:overflow-y-auto flex-col border-r border-[#334155] bg-[#000000] z-20 overflow-visible">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-[#334155] bg-[#000000]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/welcome/logo.png" alt="SpotWise" className="h-8 w-auto" />
          <span className="text-[18px] font-bold tracking-tight text-white">SpotWise</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active ? "text-white" : "text-[#94a3b8] hover:bg-[#111827] hover:text-white hover:scale-105"
                }`}
              >
                {active ? (
                  <motion.div
                    layoutId="super-admin-sidebar-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-[#f97316]"
                  />
                ) : null}
                <Icon className="relative size-4 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110" aria-hidden="true" />
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[#334155] p-4 relative">
          <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-[#111827] rounded-xl transition" onClick={() => setProfileMenuOpen((prev) => !prev)}>
            <div className="flex size-10 items-center justify-center rounded-full bg-[#f97316] text-white font-bold text-sm">SA</div>
            <div>
              <h2 className="text-sm font-semibold text-white">Super Admin</h2>
              <p className="text-[11px] text-[#94a3b8]">superadmin@spotwise.lk</p>
            </div>
          </div>

          {profileMenuOpen && (
            <div ref={profileMenuRef} className="absolute left-3 right-3 bottom-full mb-2 p-3 bg-[#000000] border border-[#334155] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-[60]">
              <div className="px-3 pb-2">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">Account</p>
                <p className="text-sm text-[#d1d5db] mb-3">Signed in as Super Admin</p>
              </div>
              <button type="button" onClick={() => { void handleSignOut(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#111827] text-sm font-medium text-[#f97316] hover:bg-[#1f2937] transition w-full justify-center">
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile top bar with hamburger */}
      <header className="lg:hidden border-b border-[#334155] bg-[#000000] px-4 py-3 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open menu" className="flex size-9 shrink-0 items-center justify-center rounded-lg text-white hover:bg-[#111827] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
            <Menu className="size-5" aria-hidden="true" />
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f97316] text-white font-bold text-xs">SA</div>
            <h1 className="truncate text-[16px] font-semibold tracking-[-0.3px] text-white">Super Admin</h1>
          </div>
        </div>
      </header>

      {/* Backdrop — always mounted, fades in/out */}
      <div
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
        className={`lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer — always mounted, slides in/out from the left */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation drawer"
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
        className={`lg:hidden fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[#334155] bg-[#000000] shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0.24,1)] motion-reduce:transition-none ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
          <div className="flex items-center gap-3 px-4 py-4 border-b border-[#334155] bg-[#000000]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/welcome/logo.png" alt="SpotWise" className="h-6 w-auto" />
            <span className="text-[16px] font-bold tracking-tight text-white">SpotWise</span>
          </div>

          <nav className="px-3 py-3 space-y-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    active ? "text-white" : "text-[#94a3b8] hover:bg-[#111827] hover:text-white"
                  }`}
                >
                  {active ? (
                    <motion.div
                      layoutId="super-admin-drawer-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-[#f97316]"
                    />
                  ) : null}
                  <Icon className="relative size-4" aria-hidden="true" />
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-[#334155] pt-3 px-3 pb-1 relative">
            <div className="flex items-center gap-3 px-3 py-3 mb-2 cursor-pointer hover:bg-[#111827] rounded-xl transition" onClick={() => setProfileMenuOpen((prev) => !prev)}>
              <div className="flex size-8 items-center justify-center rounded-full bg-[#f97316] text-white font-bold text-xs">SA</div>
              <div>
                <h2 className="text-xs font-semibold text-white">Super Admin</h2>
                <p className="text-[10px] text-[#94a3b8]">superadmin@spotwise.lk</p>
              </div>
            </div>

            {profileMenuOpen && (
              <div className="absolute left-3 right-3 bottom-full mb-1 p-3 bg-[#000000] border border-[#334155] rounded-xl shadow-[0_10px_32px_rgba(0,0,0,0.4)] z-50">
                <div className="px-3 pb-2">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">Account</p>
                  <p className="text-sm text-[#d1d5db] mb-3">Signed in as Super Admin</p>
                </div>
                <button type="button" onClick={() => { void handleSignOut(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#111827] text-sm font-medium text-[#f97316] hover:bg-[#1f2937] transition w-full justify-center">
                  <LogOut className="size-4" aria-hidden="true" />
                  Sign out
                </button>
              </div>
            )}
          </div>
      </aside>
    </>
  );
}
