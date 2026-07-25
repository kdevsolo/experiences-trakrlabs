"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { BirthdaySlide } from "@/types/experience";

export function BirthdaySlideshow({
  slides,
  accentColor,
  autoPlay = true,
}: {
  slides: BirthdaySlide[];
  accentColor: string;
  autoPlay?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (!autoPlay || count <= 1) return;
    const timer = setInterval(() => go(1), 4500);
    return () => clearInterval(timer);
  }, [autoPlay, count, go]);

  if (count === 0) return null;

  const slide = slides[index];

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border shadow-lg sm:aspect-[5/4]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 flex flex-col"
          >
            {slide.type === "image" ? (
              <>
                <img src={slide.imageUrl} alt={slide.caption ?? ""} className="h-full w-full object-cover" />
                {slide.caption ? (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 text-left text-sm text-white">
                    {slide.caption}
                  </div>
                ) : null}
              </>
            ) : (
              <div
                className="flex h-full flex-col items-center justify-center px-6 py-8 text-center"
                style={{ backgroundColor: `${accentColor}18` }}
              >
                {slide.heading ? (
                  <p className="font-serif text-xl font-semibold sm:text-2xl" style={{ color: accentColor }}>
                    {slide.heading}
                  </p>
                ) : null}
                <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-foreground sm:text-lg">{slide.body}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {count > 1 ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
              aria-label="Previous slide"
              onClick={() => go(-1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
              aria-label="Next slide"
              onClick={() => go(1)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="mt-3 flex justify-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className="h-2 w-2 rounded-full transition-all"
              style={{
                backgroundColor: i === index ? accentColor : `${accentColor}44`,
                transform: i === index ? "scale(1.25)" : undefined,
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
