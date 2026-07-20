"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";

function FullscreenPreview({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex flex-col bg-background"
        >
          <header className="flex h-14 shrink-0 items-center justify-between px-5 pt-safe">
            <p className="truncate text-[17px] font-semibold">{title}</p>
            <button
              type="button"
              onClick={onClose}
              className="touch-target flex items-center justify-center rounded-full bg-muted"
              aria-label="Close fullscreen preview"
            >
              <X className="h-5 w-5" />
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-safe">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function StudioPreview({
  title,
  children,
  fullscreenOpen,
  onFullscreenChange,
}: {
  title: string;
  children: React.ReactNode;
  fullscreenOpen?: boolean;
  onFullscreenChange?: (open: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [internalFullscreen, setInternalFullscreen] = useState(false);

  const isFullscreen = fullscreenOpen ?? internalFullscreen;
  const setFullscreen = onFullscreenChange ?? setInternalFullscreen;

  const recalculateScale = useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const contentWidth = content.scrollWidth;
    const contentHeight = content.scrollHeight;

    if (!contentWidth || !contentHeight) return;

    const padding = 16;
    const nextScale = Math.min(
      (containerWidth - padding) / contentWidth,
      (containerHeight - padding) / contentHeight,
      1
    );

    setScale(Number.isFinite(nextScale) ? nextScale : 1);
  }, []);

  useEffect(() => {
    recalculateScale();
    const observer = new ResizeObserver(recalculateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [recalculateScale, children]);

  return (
    <>
      <div className="px-5 pt-2">
        <div
          ref={containerRef}
          className="relative aspect-[3/4] max-h-[44dvh] min-h-[260px] w-full overflow-hidden rounded-3xl bg-muted shadow-soft"
        >
          <div className="flex h-full w-full items-center justify-center overflow-hidden p-2">
            <div
              ref={contentRef}
              className="studio-preview-embedded w-[390px] shrink-0 origin-center"
              style={{ transform: `scale(${scale})` }}
            >
              {children}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFullscreen(true)}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur transition-transform active:scale-95"
            aria-label="View fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          className="mt-2 w-full text-center text-caption text-accent"
        >
          Tap to view fullscreen
        </button>
      </div>

      <FullscreenPreview
        open={isFullscreen}
        onClose={() => setFullscreen(false)}
        title={title}
      >
        {children}
      </FullscreenPreview>
    </>
  );
}
