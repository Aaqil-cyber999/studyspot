"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const d = (name: string) => `/assets/detail/nav-${name}`;

const items = [
  { href: "/student/home", label: "Discover", icon: "32a11.svg", iconSize: "size-[20px]", px: "pl-[7.55px] pr-[7.56px]" },
  { href: "/student/saved", label: "Saved", icon: "d0d92.svg", iconSize: "h-[18px] w-[14px]", px: "px-[14.89px]" },
  { href: "/student/profile", label: "Profile", icon: "3d61b.svg", iconSize: "size-[16px]", px: "pl-[13.86px] pr-[13.87px]" },
];

export function StudentBottomNav() {
  const pathname = usePathname();

  return (
    <div
      className="fixed bottom-[19px] left-1/2 z-40 w-[280px] max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-clip rounded-[50px] bg-[#f97316] shadow-[0px_0px_25px_5px_rgba(0,0,0,0.5)]"
      style={{ height: "63px" }}
    >
      <div className="-translate-x-1/2 absolute flex gap-[26px] items-center left-1/2 px-[4px] py-[10px] top-0">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname?.startsWith(item.href) ? "page" : undefined}
            className={`relative content-stretch flex flex-col gap-[4px] items-center justify-center min-h-[44px] min-w-[64px] ${item.px} py-px rounded-[25px] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316]`}
          >
            {pathname?.startsWith(item.href) ? (
              <motion.div
                layoutId="student-nav-pill"
                transition={{ type: "spring", stiffness: 400, damping: 36 }}
                className="absolute inset-0 bg-[rgba(255,255,255,0.22)] rounded-[25px] shadow-[0px_5px_10px_10px_rgba(0,0,0,0.25)]"
              />
            ) : null}
            <div className={`relative shrink-0 ${item.iconSize}`}>
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={d(item.icon)} />
            </div>
            <div className="relative content-stretch flex flex-col items-start shrink-0">
              <p className="font-heading font-medium leading-[14px] text-[11px] text-white tracking-[0.33px] whitespace-nowrap">
                {item.label}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
