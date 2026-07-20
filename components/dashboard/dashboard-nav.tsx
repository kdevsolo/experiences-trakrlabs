"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileEdit, Sparkles, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", shortLabel: "Home", icon: LayoutDashboard },
  { href: "/dashboard/drafts", label: "Drafts", shortLabel: "Drafts", icon: FileEdit },
  { href: "/dashboard/experiences", label: "Experiences", shortLabel: "Live", icon: Sparkles },
  { href: "/dashboard/analytics", label: "Analytics", shortLabel: "Stats", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", shortLabel: "Settings", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile: horizontal scroll nav */}
      <nav className="-mx-1 flex gap-2 overflow-x-auto pb-1 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {links.map(({ href, shortLabel, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {shortLabel}
          </Link>
        ))}
      </nav>

      {/* Desktop: vertical sidebar */}
      <nav className="hidden space-y-1 lg:block">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              pathname === href
                ? "bg-accent/15 text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
