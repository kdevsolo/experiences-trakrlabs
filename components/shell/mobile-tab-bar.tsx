"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, FolderHeart, BarChart3, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Discover", icon: Compass },
  { href: "/library", label: "My work", icon: FolderHeart },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] border-t border-border bg-surface/95 backdrop-blur-xl pb-safe">
      <div className="flex h-[72px] items-center justify-around px-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-w-[64px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1 transition-colors",
                active ? "text-accent" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.5px]")} />
              <span className="text-[11px] font-medium">{label}</span>
              {active && (
                <span className="absolute bottom-[calc(0.5rem+var(--safe-bottom))] h-1 w-1 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
