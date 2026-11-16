"use client";

import { Check, ChevronDown } from "lucide-react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/theme-store";

function Select<Value>(props: SelectPrimitive.Root.Props<Value>) {
  return <SelectPrimitive.Root {...props} />;
}

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return <SelectPrimitive.Group data-slot="select-group" className={cn("flex flex-col gap-[2px]", className)} {...props} />;
}

function SelectGroupLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-group-label"
      className={cn("px-[10px] pb-[2px] pt-[8px] text-[11px] font-medium uppercase leading-4 tracking-[0.4px] text-[#94a3b8]", className)}
      {...props}
    />
  );
}

function SelectLabel({ className, ...props }: SelectPrimitive.Label.Props) {
  return <SelectPrimitive.Label data-slot="select-label" className={className} {...props} />;
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("truncate", className)}
      {...props}
    />
  );
}

function SelectTrigger({ className, children, ...props }: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn("outline-none", className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        data-slot="select-icon"
        className="flex shrink-0 items-center justify-center text-[#f97316]"
      >
        <ChevronDown size={18} aria-hidden />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

type SelectContentProps = SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "collisionPadding"
  >;

function SelectContent({
  className,
  side = "bottom",
  align = "start",
  sideOffset = 8,
  alignOffset,
  collisionPadding = 8,
  children,
  ...props
}: SelectContentProps) {
  const isDark = useThemeStore((state) => state.isDark);
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        alignItemWithTrigger={false}
        className="z-50 outline-none"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-admin-theme={isDark ? "dark" : "light"}
          className={cn(
            "overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white shadow-[0px_8px_24px_0px_rgba(0,0,0,0.14)] outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        >
          <SelectPrimitive.List
            data-slot="select-list"
            className="flex max-h-[280px] flex-col gap-[2px] overflow-y-auto p-[6px] outline-none"
          >
            {children}
          </SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "flex h-[38px] w-full cursor-pointer select-none items-center justify-between gap-[8px] rounded-[8px] py-[9px] pl-[10px] pr-[8px] text-left text-[14px] leading-5 text-[#334155] outline-none transition-colors data-[highlighted]:bg-[#f5f5f7] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="min-w-0 truncate">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        keepMounted
        className="flex size-4 shrink-0 items-center justify-center text-[#f97316] data-[selected]:opacity-100 opacity-0"
      >
        <Check size={16} strokeWidth={2.5} aria-hidden />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectContent, SelectGroup, SelectGroupLabel, SelectItem, SelectLabel, SelectTrigger, SelectValue };
