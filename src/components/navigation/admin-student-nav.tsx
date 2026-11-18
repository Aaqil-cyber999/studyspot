"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, MessageSquare, Compass, User } from "lucide-react";

const items = [
  { href: "/university-admin/dashboard", label: "Dashboard", icon: Compass },
  { href: "/university-admin/locations", label: "Locations", icon: MapPin },
  { href: "/university-admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/university-admin/profile", label: "Profile", icon: User },
];

export function AdminStudentNav() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <div className="fixed bottom-[19px] left-1/2 z-40 w-[386px] max-w-[calc(100vw-1.5rem)] -translate-x-1/2 overflow-clip rounded-[50px] bg-[#f97316] px-[8px] shadow-[0px_0px_25px_5px_rgba(0,0,0,0.5)]" style={{ height: "63px" }}>
      <div className="relative h-full">
        <div className="-translate-x-1/2 absolute flex gap-[6px] items-center left-1/2 px-[8px] py-[10px] top-0 h-full">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="relative content-stretch flex flex-col gap-[4px] items-center justify-center min-h-[44px] w-[84px] py-px rounded-[25px] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316]"
            >
              {isActive(item.href) ? (
                <motion.div
                  layoutId="admin-student-nav-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 36 }}
                  className="absolute inset-0 bg-[rgba(255,255,255,0.22)] rounded-[25px] shadow-[0px_5px_10px_10px_rgba(0,0,0,0.25)]"
                />
              ) : null}
              <div className="relative shrink-0">
                <item.icon className="size-5 text-white" aria-hidden="true" />
              </div>
              <div className="relative content-stretch flex flex-col items-start shrink-0">
                <p className="font-heading font-medium leading-[14px] text-[11px] text-white tracking-[0.33px] whitespace-nowrap">{item.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
