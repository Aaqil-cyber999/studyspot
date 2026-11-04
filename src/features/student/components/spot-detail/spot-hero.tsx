import type { SpotDetail } from "@/features/student/types/spot-detail";

export function SpotHero({ hero }: { hero: SpotDetail["hero"] }) {
  return (
    <div className="relative h-56 w-full overflow-clip rounded-xl bg-[#eff4ff] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]">
      <div className="absolute inset-[0_-99px_-16px_-19px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={hero.alt}
          src={hero.image}
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
        />
      </div>

      <span className="absolute bottom-[10px] right-[9px] inline-flex items-center gap-1.5 rounded-full bg-[rgba(11,28,48,0.75)] px-3 py-1 backdrop-blur-[6px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="h-[11.667px] w-[11.667px] max-w-none" src="/assets/detail/2eaba.svg" />
        <span className="font-body text-[11px] font-medium leading-[14px] tracking-[0.33px] text-white">
          {hero.photoCount} Photos
        </span>
      </span>
    </div>
  );
}
