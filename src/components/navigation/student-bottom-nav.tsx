"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, MapPin, Bookmark, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/student/home", label: "Explore", icon: House },
  { href: "/student/results", label: "Locations", icon: MapPin },
  { href: "/student/saved", label: "Saved", icon: Bookmark },
  { href: "/student/profile", label: "Profile", icon: User },
];

export function StudentBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname?.startsWith(href) ?? false;

  return (
    <nav className="fixed bottom-[8px] left-1/2 z-40 flex w-[350px] -translate-x-1/2 items-center overflow-clip rounded-[25px] border border-[rgba(255,255,255,0.6)] bg-[#f97316] py-[8px] shadow-[0px_0px_15px_50px_rgba(0,0,0,0.14)]">
      {items.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 flex-col items-center gap-px overflow-clip rounded-[20px] px-[10px] py-[6px] text-[11px]",
              active
                ? "border border-[rgba(255,255,255,0.35)] bg-white font-semibold text-[#f97316]"
                : "bg-[rgba(255,255,255,0)] font-medium text-white"
            )}
          >
            <Icon className="size-[22px] shrink-0" />
            <span
              className={cn("shrink-0", active ? 'font-["Geologica:SemiBold"]' : 'font-["Geologica:Medium"]')}
              style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}