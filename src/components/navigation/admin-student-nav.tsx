"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const d = (name: string) => `/assets/detail/nav-${name}`;

const items = [
  { href: "/university-admin/dashboard", label: "Dashboard", icon: "32a11.svg", iconSize: "size-[20px]" },
  { href: "/university-admin/locations", label: "Locations", icon: "d0d92.svg", iconSize: "h-[18px] w-[14px]" },
  { href: "/university-admin/comments", label: "Feedback", icon: "3d61b.svg", iconSize: "size-[16px]" },
  { href: "/university-admin/profile", label: "Profile", icon: "3d61b.svg", iconSize: "size-[16px]" },
];

const pillLeft = (index: number) => 2 + index * 90;

export function AdminStudentNav() {
  const pathname = usePathname();
  const activeIndex = items.findIndex((item) => pathname?.startsWith(item.href));
  const currentPillLeft = activeIndex >= 0 ? activeIndex : 0;

  return (
    <div className="fixed bottom-[19px] left-1/2 z-40 w-[386px] max-w-[calc(100vw-1.5rem)] -translate-x-1/2 overflow-clip rounded-[50px] bg-[#f97316] px-[8px] shadow-[0px_0px_25px_5px_rgba(0,0,0,0.5)]" style={{ height: "63px" }}>
      <div className="relative h-full">
        <div className="absolute h-[49px] w-[96px] rounded-[25px] bg-[rgba(255,255,255,0.22)] shadow-[0px_5px_10px_10px_rgba(0,0,0,0.25)] top-[7px]" style={{ left: `${pillLeft(currentPillLeft)}px` }} />
        <div className="-translate-x-1/2 absolute flex gap-[6px] items-center left-1/2 px-[8px] py-[10px] top-0">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="content-stretch flex flex-col gap-[4px] items-center justify-center min-h-[44px] w-[84px] py-px relative shrink-0 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316]">
              <div className={`relative shrink-0 ${item.iconSize}`}>
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={d(item.icon)} />
              </div>
              <div className="content-stretch flex flex-col items-start relative shrink-0">
                <p className="font-heading font-medium leading-[14px] text-[11px] text-white tracking-[0.33px] whitespace-nowrap">{item.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
