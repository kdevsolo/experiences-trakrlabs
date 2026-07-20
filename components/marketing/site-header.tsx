import Link from "next/link";
import { Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

export function SiteHeader({
  isAuthenticated,
  userName,
}: {
  isAuthenticated: boolean;
  userName?: string | null;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 pt-safe backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 shrink-0 text-accent" />
          <span className="truncate text-sm sm:text-base">
            <span className="sm:hidden">Experiences</span>
            <span className="hidden sm:inline">Interactive Experiences</span>
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden max-w-[120px] truncate text-sm text-muted-foreground md:inline">
                {userName ?? "Creator"}
              </span>
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "px-3")}
              >
                Dashboard
              </Link>
              <form action={signOut} className="hidden sm:block">
                <button type="submit" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/?login=1"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "px-3 text-xs sm:text-sm")}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
