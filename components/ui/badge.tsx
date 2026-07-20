import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "success" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-foreground text-background",
        variant === "secondary" && "bg-muted text-muted-foreground",
        variant === "success" && "bg-emerald-500/15 text-emerald-600",
        variant === "warning" && "bg-amber-500/15 text-amber-700",
        className
      )}
      {...props}
    />
  );
}
