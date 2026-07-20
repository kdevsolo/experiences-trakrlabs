"use client";

import { useEffect, useRef } from "react";
import { trackAnalyticsEvent } from "@/lib/actions/analytics";

export function ViewTracker({
  experienceId,
}: {
  experienceId: string;
}) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    void trackAnalyticsEvent(experienceId, "open");
  }, [experienceId]);

  return null;
}

export function trackShareCopy(experienceId: string) {
  void trackAnalyticsEvent(experienceId, "share", { method: "copy" });
}

export function trackApologyAccept(experienceId: string) {
  void trackAnalyticsEvent(experienceId, "accept_apology");
}
