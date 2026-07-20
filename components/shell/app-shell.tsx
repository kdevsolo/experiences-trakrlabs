"use client";

import { usePathname } from "next/navigation";
import { MobileTabBar } from "./mobile-tab-bar";
import { AppHeader } from "./app-header";
import { cn } from "@/lib/utils";

const CHROMELESS_PREFIXES = ["/create", "/e/"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = CHROMELESS_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <AppHeader />
      <div className={cn("min-h-screen-mobile pb-tab-bar")}>{children}</div>
      <MobileTabBar />
    </>
  );
}
