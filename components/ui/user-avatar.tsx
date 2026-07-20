import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  { bg: "#FECDD3", text: "#9F1239" },
  { bg: "#FDE68A", text: "#92400E" },
  { bg: "#BBF7D0", text: "#166534" },
  { bg: "#BFDBFE", text: "#1E40AF" },
  { bg: "#DDD6FE", text: "#5B21B6" },
  { bg: "#FBCFE8", text: "#9D174D" },
  { bg: "#A5F3FC", text: "#155E75" },
  { bg: "#FED7AA", text: "#9A3412" },
  { bg: "#C7D2FE", text: "#3730A3" },
  { bg: "#D9F99D", text: "#3F6212" },
];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getInitials(name?: string, email?: string) {
  const source = name?.trim() || email?.split("@")[0] || "?";
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

export function UserAvatar({
  name,
  email,
  seed,
  className,
  size = "lg",
}: {
  name?: string;
  email?: string;
  seed?: string;
  className?: string;
  size?: "md" | "lg";
}) {
  const colorKey = seed ?? email ?? name ?? "user";
  const palette = AVATAR_COLORS[hashString(colorKey) % AVATAR_COLORS.length];
  const initials = getInitials(name, email);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold shadow-soft",
        size === "lg" ? "h-20 w-20 text-2xl" : "h-11 w-11 text-sm",
        className
      )}
      style={{ backgroundColor: palette.bg, color: palette.text }}
      aria-hidden
    >
      {initials}
    </div>
  );
}
