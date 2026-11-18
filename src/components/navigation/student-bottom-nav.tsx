"use client";

import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const d = (name: string) => `/assets/detail/nav-${name}`;
const SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

const items = [
  { href: "/student/home", label: "Discover", icon: "32a11.svg", iconSize: "size-[20px]" },
  { href: "/student/saved", label: "Saved", icon: "d0d92.svg", iconSize: "h-[18px] w-[14px]" },
  { href: "/student/profile", label: "Profile", icon: "3d61b.svg", iconSize: "size-[16px]" },
] as const;

type NavItem = (typeof items)[number];

// Each tab is its own memo boundary: on tab switch only the two tabs whose
// active state flips re-render — untouched icons/labels bail out.
const NavTab = memo(function NavTab({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className="relative content-stretch flex flex-col gap-[4px] items-center justify-center h-[49px] w-[84px] py-px rounded-[25px] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316]"
    >
      {isActive ? (
        <motion.div
          layoutId="student-nav-pill"
          transition={SPRING}
          className="absolute inset-0 bg-[rgba(255,255,255,0.22)] rounded-[25px] shadow-[0px_5px_10px_10px_rgba(0,0,0,0.25)]"
        />
      ) : null}
      <div className={`relative shrink-0 ${item.iconSize}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="absolute inset-0 max-w-none size-full" src={d(item.icon)} />
      </div>
      <p className="relative font-heading font-medium leading-[14px] text-[11px] text-white tracking-[0.33px] whitespace-nowrap">
        {item.label}
      </p>
    </Link>
  );
});

export const StudentBottomNav = memo(function StudentBottomNav() {
  const pathname = usePathname();
  const activeHref = items.find((item) => pathname?.startsWith(item.href))?.href;

  return (
    <div
      className="fixed bottom-[19px] left-1/2 z-40 w-[280px] max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-clip rounded-[50px] bg-[#f97316] shadow-[0px_0px_25px_5px_rgba(0,0,0,0.5)]"
      style={{ height: "63px" }}
    >
      <nav aria-label="Student navigation" className="-translate-x-1/2 absolute flex gap-[6px] items-center left-1/2 px-[4px] py-[7px] top-0">
        {items.map((item) => (
          <NavTab key={item.href} item={item} isActive={item.href === activeHref} />
        ))}
      </nav>
    </div>
  );
});
