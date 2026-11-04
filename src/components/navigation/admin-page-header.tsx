"use client";

import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  action?: { href: string; label: string; icon: LucideIcon };
}

export function AdminPageHeader({ title, subtitle, backHref, action }: AdminPageHeaderProps) {
  return (
    <header className="flex items-center justify-between bg-white px-[24px] pb-[16px] pt-[24px]">
      <div className="flex min-w-0 items-center gap-[12px]">
        {backHref ? (
          <Link href={backHref} aria-label="Go back" className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-[#ddd] text-[#334155] focus-visible:outline-2 focus-visible:outline-[#f97316]">
            <ArrowLeft className="size-[18px]" />
          </Link>
        ) : null}
        <div className="min-w-0">
          <h1 className="truncate text-[20px] font-semibold leading-[24px] tracking-[-0.3px] text-[#0f172a]">{title}</h1>
          {subtitle ? <p className="mt-[2px] truncate text-[12px] leading-[16px] text-[#64748b]">{subtitle}</p> : null}
        </div>
      </div>
      {action ? (
        <Link href={action.href} aria-label={action.label} className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-[#f97316] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]">
          <action.icon className="size-[18px]" />
        </Link>
      ) : null}
    </header>
  );
}
