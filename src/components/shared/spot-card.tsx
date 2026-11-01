import Link from "next/link";
import { Bookmark, Star, Clock, Wifi, Zap } from "lucide-react";
import type { StudyLocation } from "@/types";
import { cn } from "@/lib/utils";

interface SpotCardProps {
  location: StudyLocation;
  href?: string;
}

const amenityIcon = (amenity: string) => {
  if (amenity.toLowerCase().includes("wi-fi")) return <Wifi className="size-3.5" />;
  if (amenity.toLowerCase().includes("power")) return <Zap className="size-3.5" />;
  return null;
};

export function SpotCard({ location, href }: SpotCardProps) {
  return (
    <Link
      href={href ?? "#"}
      className="block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="relative h-40 bg-orange-100">
        <div className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90">
          <Bookmark className={cn("size-4", location.saved ? "fill-orange-500 text-orange-500" : "text-slate-500")} />
        </div>
      </div>
      <div className="space-y-2 p-4">
        <h3 className="text-base font-semibold text-slate-900">{location.name}</h3>
        <p className="text-sm text-slate-500">
          {location.building} · {location.floor}
        </p>
        <div className="flex items-center gap-1 text-sm text-orange-500">
          <Star className="size-3.5 fill-orange-500" />
          <span className="font-medium">{location.rating}</span>
          <span className="text-slate-400">· {location.reviews} reviews</span>
          {location.hours ? (
            <>
              <Clock className="ml-2 size-3.5 text-slate-400" />
              <span className="text-slate-400">{location.hours}</span>
            </>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {location.amenities.slice(0, 3).map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs text-orange-600"
            >
              {amenityIcon(a)}
              {a}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}