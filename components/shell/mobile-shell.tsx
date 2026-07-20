"use client";

import { cn } from "@/lib/utils";

export function MobileShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("px-5 pt-4", className)}>{children}</div>;
}
