import { cn } from "@/lib/utils";

export function ExperienceViewport({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 py-8 pt-safe pb-safe",
        className
      )}
    >
      {children}
    </div>
  );
}
