"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const d = (name: string) => `/assets/detail/nav-${name}`;

const items = [
  { href: "/student/home", label: "Discover", icon: "32a11.svg", iconSize: "size-[20px]", left: "left-[8px]", px: "pl-[7.55px] pr-[7.56px]" },
  { href: "/student/saved", label: "Saved", icon: "d0d92.svg", iconSize: "h-[18px] w-[14px]", left: "left-[98px]", px: "px-[14.89px]" },
  { href: "/student/profile", label: "Profile", icon: "3d61b.svg", iconSize: "size-[16px]", left: "left-[188px]", px: "pl-[13.86px] pr-[13.87px]" },
];

export function StudentBottomNav() {
  const pathname = usePathname();
  const activeIndex = items.findIndex((item) => pathname?.startsWith(item.href));
  const currentPillLeft = activeIndex >= 0 ? items[activeIndex].left : "left-[9px]";

  return (
    <div
      className="fixed bottom-[19px] left-1/2 z-40 w-[280px] max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-clip rounded-[50px] bg-[#f97316] shadow-[0px_0px_25px_5px_rgba(0,0,0,0.5)]"
      style={{ height: "63px" }}
    >
      <div className={`absolute bg-[rgba(255,255,255,0.22)] h-[49px] w-[84px] rounded-[25px] shadow-[0px_5px_10px_10px_rgba(0,0,0,0.25)] top-[7px] ${currentPillLeft}`} />
      <div className="-translate-x-1/2 absolute flex gap-[26px] items-center left-1/2 px-[4px] py-[10px] top-0">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`content-stretch flex flex-col gap-[4px] items-center justify-center min-h-[44px] min-w-[64px] ${item.px} py-px relative shrink-0`}
          >
            <div className={`relative shrink-0 ${item.iconSize}`}>
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={d(item.icon)} />
            </div>
            <div className="content-stretch flex flex-col items-start relative shrink-0">
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
