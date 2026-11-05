"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const d = (name: string) => `/assets/detail/nav-${name}`;

const items = [
  { href: "/university-admin/dashboard", label: "Dashboard", icon: "32a11.svg", iconSize: "size-[20px]", left: "left-[6px]", px: "px-[10px]" },
  { href: "/university-admin/locations", label: "Locations", icon: "d0d92.svg", iconSize: "h-[18px] w-[14px]", left: "left-[96px]", px: "px-[10px]" },
  { href: "/university-admin/comments", label: "Comments", icon: "3d61b.svg", iconSize: "size-[16px]", left: "left-[186px]", px: "px-[10px]" },
  { href: "/university-admin/profile", label: "Profile", icon: "3d61b.svg", iconSize: "size-[16px]", left: "left-[276px]", px: "px-[10px]" },
];

export function AdminStudentNav() {
  const pathname = usePathname();
  const activeIndex = items.findIndex((item) => pathname?.startsWith(item.href));
  const currentPillLeft = activeIndex >= 0 ? items[activeIndex].left : "left-[6px]";

  return (
    <div
      className="fixed bottom-[19px] left-1/2 z-40 w-[calc(100%-32px)] max-w-[380px] -translate-x-1/2 overflow-clip rounded-[50px] bg-[#f97316] shadow-[0px_0px_25px_5px_rgba(0,0,0,0.5)]"
      style={{ height: "63px" }}
    >
      <div className={`absolute bg-[rgba(255,255,255,0.22)] h-[49px] w-[84px] rounded-[25px] shadow-[0px_5px_10px_10px_rgba(0,0,0,0.25)] top-[7px] ${currentPillLeft}`} />
      <div className="absolute flex items-center justify-between left-[6px] right-[6px] py-[10px] top-0">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`content-stretch flex flex-col gap-[4px] items-center justify-center min-h-[44px] w-[84px] ${item.px} py-px relative shrink-0`}
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
