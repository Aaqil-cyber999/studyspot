"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
}

export function AdminBottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Super Admin navigation" className="admin-bottom-nav fixed bottom-3 left-1/2 z-40 flex w-[calc(100%-24px)] max-w-[396px] -translate-x-1/2 items-center justify-around rounded-2xl border border-white/30 bg-orange-500/80 px-2 py-2 text-white shadow-[0_12px_30px_rgba(124,45,18,0.24)] backdrop-blur-xl">
      {items.map((item) => {
        const active = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-w-20 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-medium transition-all duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500",
              active && "bg-white/25 shadow-sm"
            )}
          >
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}