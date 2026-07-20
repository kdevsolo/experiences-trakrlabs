"use client";

import { cn } from "@/lib/utils";

export function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-muted md:flex md:items-start md:justify-center md:p-4">
      <div
        className={cn(
          "relative mx-auto min-h-dvh w-full max-w-[430px] bg-background md:min-h-[calc(100dvh-2rem)] md:overflow-hidden md:rounded-[2rem] md:border md:border-border md:shadow-soft"
        )}
      >
        {children}
      </div>
    </div>
  );
}
