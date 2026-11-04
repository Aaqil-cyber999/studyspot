"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";

function Menu(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="menu" {...props} />;
}

function MenuTrigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger
      data-slot="menu-trigger"
      className={cn("outline-none", className)}
      {...props}
    />
  );
}

type MenuContentProps = MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "collisionPadding"
  >;

function MenuContent({
  className,
  side = "bottom",
  align = "center",
  sideOffset = 8,
  alignOffset,
  collisionPadding = 8,
  children,
  ...props
}: MenuContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className="z-50 outline-none"
      >
        <MenuPrimitive.Popup
          data-slot="menu-content"
          className={cn(
            "flex flex-col gap-[2px] rounded-[12px] border border-[#e2e8f0] bg-[#ddd] p-[6px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.14)] outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function MenuItem({ className, ...props }: MenuPrimitive.Item.Props) {
  return (
    <MenuPrimitive.Item
      data-slot="menu-item"
      className={cn(
        "flex h-[38px] w-full cursor-pointer select-none items-center gap-[8px] rounded-[8px] px-[10px] py-[9px] text-left text-[14px] leading-5 text-[#334155] outline-none transition-colors data-[highlighted]:bg-[#f5f5f7]",
        className,
      )}
      {...props}
    />
  );
}

function MenuRadioGroup({ className, ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="menu-radio-group"
      className={cn("flex flex-col gap-[2px]", className)}
      {...props}
    />
  );
}

function MenuRadioItem({ className, ...props }: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menu-radio-item"
      className={cn(
        "flex h-[38px] w-full cursor-pointer select-none items-center justify-between gap-2 rounded-[8px] px-[10px] py-[9px] text-left text-[14px] leading-5 outline-none transition-colors",
        className,
      )}
      {...props}
    />
  );
}

function MenuRadioItemIndicator({ className, ...props }: MenuPrimitive.RadioItemIndicator.Props) {
  return (
    <MenuPrimitive.RadioItemIndicator
      data-slot="menu-radio-item-indicator"
      className={cn("flex size-4 shrink-0 items-center justify-center", className)}
      {...props}
    />
  );
}

export {
  Menu,
  MenuContent,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRadioItemIndicator,
  MenuTrigger,
};
