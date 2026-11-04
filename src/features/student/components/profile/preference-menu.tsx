"use client";

import { Check } from "lucide-react";
import toast from "react-hot-toast";
import {
  Menu,
  MenuContent,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRadioItemIndicator,
  MenuTrigger,
} from "@/components/ui/menu";

interface PreferenceMenuProps {
  label: string;
  iconSrc: string;
  value: string;
  options: readonly string[];
  onValueChange: (value: string) => void;
  withBorder?: boolean;
}

export function PreferenceMenu({
  label,
  iconSrc,
  value,
  options,
  onValueChange,
  withBorder = false,
}: PreferenceMenuProps) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={`${label}: ${value}. Change ${label.toLowerCase()}`}
        className={`flex w-full cursor-pointer items-center justify-between px-[16px] py-[15px] text-left transition-colors hover:bg-[#f8fafc] focus-visible:ring-2 focus-visible:ring-[#f97316]/60 focus-visible:ring-inset focus-visible:outline-none data-[popup-open]:bg-[#f8fafc] ${
          withBorder ? "border-b border-[#e2e8f0]" : ""
        }`}
      >
        <span className="flex items-center gap-[12px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="size-[20px] max-w-none" src={iconSrc} />
          <span className="text-[14px] leading-5 text-[#334155]">{label}</span>
        </span>
        <span className="flex items-center gap-[6px]">
          <span className="text-[14px] leading-5 font-medium text-[#0f172a]">{value}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="size-[16px] max-w-none" src="/assets/profile/23186.svg" />
        </span>
      </MenuTrigger>

      <MenuContent side="bottom" align="end" sideOffset={8} className="w-[220px]">
        <MenuRadioGroup
          value={value}
          onValueChange={(next) => {
            if (typeof next !== "string") return;
            onValueChange(next);
            toast.success(`${label} set to ${next}`);
          }}
        >
          {options.map((option) => (
            <MenuRadioItem
              key={option}
              value={option}
              closeOnClick
              className="text-[#334155] data-[checked]:bg-[#f5f5f7] data-[checked]:font-medium data-[checked]:text-[#0f172a] data-[highlighted]:bg-[#f5f5f7]"
            >
              <span>{option}</span>
              <MenuRadioItemIndicator>
                <Check
                  aria-hidden="true"
                  className="size-4 text-[#f97316]"
                  strokeWidth={2.5}
                />
              </MenuRadioItemIndicator>
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  );
}
