"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { amenityOptions } from "@/mocks/data/student";

const CHIP_ICONS: Record<string, string> = {
  "Wi-Fi": "/assets/profile/b2610.svg",
  "Power outlet": "/assets/profile/ba296.svg",
  Cafeteria: "/assets/profile/amenity-cafeteria-white.svg",
  Printer: "/assets/profile/amenity-printer-white.svg",
  Parking: "/assets/profile/amenity-parking-white.svg",
  Elevator: "/assets/profile/amenity-elevator-white.svg",
  "Accessible seating": "/assets/profile/amenity-accessible-seating-white.svg",
};

const MENU_ICONS: Record<string, string> = {
  "Wi-Fi": "/assets/profile/amenity-wifi.svg",
  "Power outlet": "/assets/profile/amenity-power-outlet.svg",
  Cafeteria: "/assets/profile/amenity-cafeteria.svg",
  Printer: "/assets/profile/amenity-printer.svg",
  Parking: "/assets/profile/amenity-parking.svg",
  Elevator: "/assets/profile/amenity-elevator.svg",
  "Accessible seating": "/assets/profile/amenity-accessible-seating.svg",
};

interface AmenitiesCardProps {
  amenities: readonly string[];
  onAddAmenity: (amenity: string) => void;
  onRemoveAmenity: (amenity: string) => void;
}

export function AmenitiesCard({
  amenities,
  onAddAmenity,
  onRemoveAmenity,
}: AmenitiesCardProps) {
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const availableAmenities = amenityOptions.filter(
    (amenity) => !amenities.includes(amenity),
  );

  const handleRemove = (amenity: string) => {
    const isLast = amenities.length === 1;
    onRemoveAmenity(amenity);
    toast.success(`${amenity} removed`);
    if (isLast) {
      requestAnimationFrame(() => addButtonRef.current?.focus());
    }
  };

  const handleAdd = (amenity: string) => {
    onAddAmenity(amenity);
    toast.success(`${amenity} added`);
  };

  return (
    <div className="overflow-clip rounded-[16px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
      <ul className="flex flex-wrap items-start gap-[8px] px-[16px] py-[14px]">
        {amenities.length === 0 ? (
          <li className="flex h-[32px] min-w-0 flex-1 items-center justify-center">
            <p
              role="status"
              className="text-center text-[13px] leading-[16px] font-medium text-[#64748b]"
            >
              No amenities added yet. Use + to add one.
            </p>
          </li>
        ) : null}
        {amenities.map((amenity) => {
          const iconSrc = CHIP_ICONS[amenity];

          return (
            <li
              key={amenity}
              className="flex shrink-0 items-center gap-[6px] rounded-[18px] bg-[#f97316] py-[8px] pl-[14px] pr-[10px]"
            >
              {iconSrc ? (
                <span className="flex size-[14px] shrink-0 items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" className="max-w-none" src={iconSrc} />
                </span>
              ) : null}
              <span className="text-[13px] leading-[16px] font-medium whitespace-nowrap text-white">
                {amenity}
              </span>
              <button
                type="button"
                aria-label={`Remove ${amenity}`}
                onClick={() => handleRemove(amenity)}
                className="flex size-[16px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-white outline-none transition-colors hover:bg-[#fff7ed] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316]"
              >
                <X
                  aria-hidden="true"
                  className="size-[10px] text-[#f97316]"
                  strokeWidth={2.5}
                />
              </button>
            </li>
          );
        })}
        {availableAmenities.length > 0 ? (
          <li className="w-full">
            <Menu>
              <MenuTrigger
                ref={addButtonRef}
                aria-label="Add amenity"
                className="flex h-[32px] w-full cursor-pointer items-center justify-center rounded-[16px] bg-[#fed7aa] p-[8px] outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#f97316]/60 focus-visible:outline-none data-[popup-open]:opacity-90"
              >
                <span className="flex size-[16px] items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    className="size-[11px] max-w-none"
                    src="/assets/profile/d4973.svg"
                  />
                </span>
              </MenuTrigger>
              <MenuContent
                side="bottom"
                align="center"
                sideOffset={8}
                className="w-[220px] bg-white"
              >
                {availableAmenities.map((amenity) => (
                  <MenuItem
                    key={amenity}
                    closeOnClick
                    onClick={() => handleAdd(amenity)}
                  >
                    <span className="flex size-[16px] shrink-0 items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="" className="max-w-none" src={MENU_ICONS[amenity]} />
                    </span>
                    <span>{amenity}</span>
                  </MenuItem>
                ))}
              </MenuContent>
            </Menu>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
