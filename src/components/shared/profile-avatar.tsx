import { cn } from "@/lib/utils";

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return "";
  if (words.length === 1) {
    return Array.from(words[0]).slice(0, 2).join("").toUpperCase();
  }

  const first = Array.from(words[0])[0] ?? "";
  const last = Array.from(words[words.length - 1])[0] ?? "";

  return `${first}${last}`.toUpperCase();
}

interface ProfileAvatarProps {
  name: string;
  imageUrl?: string | null;
  className?: string;
  textClassName?: string;
}

/**
 * Circular profile avatar: shows the uploaded photo when there is one and
 * falls back to the member's initials on the orange brand circle.
 */
export function ProfileAvatar({
  name,
  imageUrl,
  className = "size-[56px]",
  textClassName = "text-[18px]",
}: ProfileAvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-clip rounded-full bg-[#f97316]",
        className,
      )}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt="" className="size-full object-cover" src={imageUrl} />
      ) : (
        <p aria-hidden="true" className={cn("font-semibold text-white", textClassName)}>
          {getInitials(name)}
        </p>
      )}
    </div>
  );
}
