"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bookmark, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/student/home", label: "Home", icon: Home },
  { href: "/student/saved", label: "Saved", icon: Bookmark },
  { href: "/student/profile", label: "Profile", icon: User },
];

export function StudentBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex max-w-md items-center justify-around rounded-t-2xl bg-orange-500 px-2 py-2 text-white shadow-lg">
      {items.map((item) => {
        const active = pathname?.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-1 text-xs",
              active && "bg-white/20"
            )}
          >
            <Icon className="size-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}