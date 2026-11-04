import type { SpotAmenity } from "@/features/student/types/spot-detail";

export function AmenitiesSection({ amenities }: { amenities: SpotAmenity[] }) {
  return (
    <section aria-labelledby="amenities-heading" className="flex w-full flex-col gap-[15px]">
      <div className="flex w-full items-center justify-between gap-2">
        <h2 id="amenities-heading" className="font-body text-[18px] font-bold leading-6 text-[#0b1c30]">
          Amenities &amp; Features
        </h2>
        <p className="font-body text-[11px] font-semibold leading-[14px] tracking-[0.33px] text-[#9d4300]">
          {amenities.length} Included
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-2">
        {amenities.map((amenity) => (
          <li
            key={amenity.label}
            className="flex h-14 items-center gap-2.5 rounded-xl bg-[#ddd] p-3 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#e5eeff]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                src={amenity.icon}
                width={amenity.iconWidth}
                height={amenity.iconHeight}
                className="max-w-none"
                style={{ width: amenity.iconWidth, height: amenity.iconHeight }}
              />
            </span>

            <div className="flex min-w-0 flex-col items-start">
              <p className="w-full truncate font-body text-[12px] font-semibold leading-4 tracking-[0.3px] text-[#0b1c30]">
                {amenity.label}
              </p>
              <p className="w-full truncate font-body text-[11px] font-medium leading-[14px] tracking-[0.33px] text-[#515f74]">
                {amenity.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
