"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

const d = (name: string) => `/assets/detail/nav-${name}`;

const items = [
  { href: "/university-admin/dashboard", label: "Dashboard", icon: "32a11.svg", iconSize: "size-[20px]" },
  { href: "/university-admin/locations", label: "Locations", icon: "d0d92.svg", iconSize: "h-[18px] w-[14px]" },
  { href: "/university-admin/comments", label: "Comments", icon: "3d61b.svg", iconSize: "size-[16px]" },
  { href: "/university-admin/reports", label: "Reports", icon: "3d61b.svg", iconSize: "size-[16px]" },
  { href: "/university-admin/profile", label: "Profile", icon: "3d61b.svg", iconSize: "size-[16px]" },
];

const glassWidth = 64;

export function AdminStudentNav() {
  const pathname = usePathname();
  const activeIndex = items.findIndex((item) => pathname?.startsWith(item.href));
  const selectedIndex = activeIndex >= 0 ? activeIndex : 0;
  const navRef = useRef<HTMLDivElement>(null);
  const [navWidth, setNavWidth] = useState(380);
  const [glassPosition, setGlassPosition] = useState(0);
  const dragStart = useRef<{ pointerX: number; position: number } | null>(null);

  const getSelectedPosition = useCallback((index: number, width = navWidth) => {
    const cellWidth = (width - 12) / items.length;
    return (cellWidth - glassWidth) / 2 + index * cellWidth;
  }, [navWidth]);

  const getMaxPosition = () => {
    return Math.max(0, navWidth - 12 - glassWidth);
  };

  useEffect(() => {
    if (!dragStart.current) {
      setGlassPosition(getSelectedPosition(selectedIndex));
    }
  }, [getSelectedPosition, selectedIndex]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      const width = nav.clientWidth;
      setNavWidth(width);
      if (!dragStart.current) {
        setGlassPosition(getSelectedPosition(selectedIndex, width));
      }
    });

    resizeObserver.observe(nav);
    return () => resizeObserver.disconnect();
  }, [getSelectedPosition, selectedIndex]);

  const moveGlass = (pointerX: number) => {
    if (!dragStart.current) {
      return;
    }

    const nextPosition = dragStart.current.position + pointerX - dragStart.current.pointerX;
    setGlassPosition(Math.max(0, Math.min(getMaxPosition(), nextPosition)));
  };

  const stopDragging = () => {
    dragStart.current = null;
  };

  const handleGlassKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    setGlassPosition((position) => Math.max(0, Math.min(getMaxPosition(), position + direction * 10)));
  };

  return (
    <div
      ref={navRef}
      onPointerDown={(event) => {
        if (event.target instanceof Element && event.target.closest("a")) {
          return;
        }

        event.currentTarget.setPointerCapture(event.pointerId);
        dragStart.current = { pointerX: event.clientX, position: glassPosition };
      }}
      onPointerMove={(event) => moveGlass(event.clientX)}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      className="fixed bottom-[19px] left-1/2 z-40 w-[calc(100%-32px)] max-w-[380px] -translate-x-1/2 overflow-clip rounded-[50px] bg-[#f97316] shadow-[0px_0px_25px_5px_rgba(0,0,0,0.5)]"
      style={{ height: "63px" }}
    >
      <div
        role="slider"
        aria-label="Move liquid glass navigation highlight"
        aria-valuemin={0}
        aria-valuemax={getMaxPosition()}
        aria-valuenow={Math.round(glassPosition)}
        tabIndex={0}
        onKeyDown={handleGlassKeyDown}
        className="pointer-events-none absolute left-[6px] top-[7px] h-[49px] w-[64px] cursor-grab touch-none rounded-[25px] bg-[rgba(255,255,255,0.22)] shadow-[0px_5px_10px_10px_rgba(0,0,0,0.25)] transition-transform duration-100 ease-out active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316]"
        style={{ transform: `translateX(${glassPosition}px)` }}
      />
      <div className="absolute left-[6px] right-[6px] top-0 grid grid-cols-5 items-center py-[10px]">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="content-stretch mx-auto flex min-h-[44px] w-[64px] flex-col items-center justify-center gap-[3px] px-1 py-px relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316]"
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
