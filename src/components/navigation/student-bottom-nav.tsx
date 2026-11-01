"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Bookmark, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/student/home", label: "Discover", icon: Compass },
  { href: "/student/saved", label: "Saved", icon: Bookmark },
  { href: "/student/profile", label: "Profile", icon: User },
];

export function StudentBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname?.startsWith(href) ?? false;

  return (
    <nav className="fixed bottom-[19px] left-1/2 z-40 flex h-[63px] w-[280px] -translate-x-1/2 items-center justify-center gap-[26px] overflow-clip rounded-[50px] bg-[#f97316] px-[4px] py-[10px] shadow-[0px_0px_25px_5px_rgba(0,0,0,0.5)]">
      {items.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-[44px] min-w-[64px] flex-col items-center justify-center gap-[4px] rounded-[20px] px-[7.55px] py-px text-[11px] tracking-[0.33px] text-white",
              active && "rounded-[25px] bg-[rgba(255,255,255,0.22)] shadow-[0px_5px_10px_10px_rgba(0,0,0,0.25)]"
            )}
          >
            <Icon className="size-[20px] shrink-0" />
            <span className='font-[family-name:var(--font-inter)] font-medium leading-[14px]' style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}