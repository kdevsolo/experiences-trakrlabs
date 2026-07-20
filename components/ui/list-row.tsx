import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ListRow({
  href,
  onClick,
  icon,
  title,
  subtitle,
  trailing,
  statusDot,
  className,
}: {
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  statusDot?: "green" | "amber" | "muted";
  className?: string;
}) {
  const content = (
    <>
      {icon && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-muted text-xl">
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{title}</p>
          {statusDot && (
            <span
              className={cn(
                "h-2 w-2 shrink-0 rounded-full",
                statusDot === "green" && "bg-emerald-500",
                statusDot === "amber" && "bg-amber-500",
                statusDot === "muted" && "bg-muted-foreground/40"
              )}
            />
          )}
        </div>
        {subtitle && <p className="truncate text-caption">{subtitle}</p>}
      </div>
      {trailing ?? (href || onClick ? <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" /> : null)}
    </>
  );

  const classes = cn(
    "flex w-full items-center gap-3 rounded-2xl bg-surface p-4 shadow-soft transition-transform active:scale-[0.99]",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(classes, "text-left")}>
        {content}
      </button>
    );
  }

  return <div className={classes}>{content}</div>;
}

export function ListGroup({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      {title && <p className="px-1 text-caption uppercase tracking-wider">{title}</p>}
      <div className="space-y-2">{children}</div>
    </div>
  );
}
