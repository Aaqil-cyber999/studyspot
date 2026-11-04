"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MapPin, MessageSquare, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
}

const icons = {
  Dashboard: LayoutDashboard,
  Locations: MapPin,
  Comments: MessageSquare,
  Profile: UserRound,
} as const;

export function AdminBottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  if (pathname === "/university-admin/login") return null;
  const activeIndex = items.findIndex((item) => pathname?.startsWith(item.href));

  return (
    <nav className="fixed bottom-[19px] left-1/2 z-40 flex h-[63px] w-[364px] max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center overflow-clip rounded-[50px] bg-[#f97316] px-[8px] shadow-[0px_0px_25px_5px_rgba(0,0,0,0.5)]">
      <div
        aria-hidden="true"
        className="absolute top-[7px] h-[49px] w-[88px] rounded-[25px] bg-[rgba(255,255,255,0.22)] shadow-[0px_5px_10px_10px_rgba(0,0,0,0.25)] transition-[left]"
        style={{ left: `${7.5 + Math.max(activeIndex, 0) * 87}px` }}
      />
      {items.map((item) => {
        const active = pathname?.startsWith(item.href);
        const Icon = icons[item.label as keyof typeof icons] ?? LayoutDashboard;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative z-10 flex min-w-0 flex-1 flex-col items-center justify-center gap-[4px] py-px text-white",
            )}
          >
            <Icon aria-hidden="true" className={cn("size-[18px]", active && "stroke-[2.25]")} />
            <span className="whitespace-nowrap font-heading text-[11px] font-medium leading-[14px] tracking-[0.33px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}