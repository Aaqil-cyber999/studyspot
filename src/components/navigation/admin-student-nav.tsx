"use client";

import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, MessageSquare, Compass, User } from "lucide-react";

const SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

const items = [
  { href: "/university-admin/dashboard", label: "Dashboard", icon: Compass },
  { href: "/university-admin/locations", label: "Locations", icon: MapPin },
  { href: "/university-admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/university-admin/profile", label: "Profile", icon: User },
] as const;

type NavItem = (typeof items)[number];

// Each tab is its own memo boundary: on tab switch only the two tabs whose
// active state flips re-render — untouched icons/labels bail out.
const NavTab = memo(function NavTab({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className="relative flex flex-col gap-[4px] items-center justify-center h-[49px] w-[84px] py-px rounded-[25px] shrink-0 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316]"
    >
      {isActive ? (
        <motion.div
          layoutId="admin-student-nav-pill"
          transition={SPRING}
          className="absolute -inset-x-[6px] inset-y-0 bg-[rgba(255,255,255,0.22)] rounded-[25px] shadow-[0px_5px_10px_10px_rgba(0,0,0,0.25)]"
        />
      ) : null}
      <Icon className="relative size-5 text-white" aria-hidden="true" />
      <p className="relative font-heading font-medium leading-[14px] text-[11px] text-white tracking-[0.33px] whitespace-nowrap">{item.label}</p>
    </Link>
  );
});

export const AdminStudentNav = memo(function AdminStudentNav() {
  const pathname = usePathname();
  const activeHref = items.find((item) => pathname?.startsWith(item.href))?.href;

  return (
    <div className="fixed bottom-[19px] left-1/2 z-40 w-[386px] max-w-[calc(100vw-1.5rem)] -translate-x-1/2 overflow-clip rounded-[50px] bg-[#f97316] px-[8px] shadow-[0px_0px_25px_5px_rgba(0,0,0,0.5)]" style={{ height: "63px" }}>
      <nav aria-label="University admin navigation" className="relative h-full">
        <div className="-translate-x-1/2 absolute flex gap-[6px] items-center left-1/2 px-[8px] py-[7px] top-0 h-full">
          {items.map((item) => (
            <NavTab key={item.href} item={item} isActive={item.href === activeHref} />
          ))}
        </div>
      </nav>
    </div>
  );
});
