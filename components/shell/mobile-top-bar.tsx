"use client";

import Link from "next/link";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileTopBar({
  title,
  backHref = "/",
  onBack,
  rightAction,
  className,
}: {
  title?: string;
  backHref?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center gap-2 bg-background/90 px-5 pt-safe backdrop-blur-xl",
        className
      )}
    >
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="touch-target flex shrink-0 items-center justify-center rounded-full text-foreground"
          aria-label="Go back"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      ) : (
        <Link
          href={backHref}
          className="touch-target flex shrink-0 items-center justify-center rounded-full text-foreground"
          aria-label="Go back"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
      )}
      {title && (
        <h1 className="flex-1 truncate text-center text-[17px] font-semibold">{title}</h1>
      )}
      <div className="flex w-10 shrink-0 items-center justify-end">
        {rightAction ?? <span className="w-6" />}
      </div>
    </header>
  );
}

export function OverflowButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="touch-target flex items-center justify-center rounded-full text-foreground"
      aria-label="More options"
    >
      <MoreHorizontal className="h-5 w-5" />
    </button>
  );
}
