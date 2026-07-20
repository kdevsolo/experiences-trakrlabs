"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getExperienceCoverImage } from "@/lib/templates/cover-images";

export function TileCard({
  href,
  name,
  description,
  type,
  available = true,
  index = 0,
}: {
  href: string;
  name: string;
  description?: string;
  type: string;
  available?: boolean;
  index?: number;
}) {
  const coverImage = getExperienceCoverImage(type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
    >
      <Link
        href={available ? href : "#"}
        className={cn("group block", !available && "pointer-events-none")}
      >
        <div
          className={cn(
            "relative aspect-[4/5] overflow-hidden rounded-3xl shadow-soft transition-transform active:scale-[0.97]",
            !available && "opacity-60 grayscale"
          )}
        >
          <Image
            src={coverImage}
            alt={name}
            fill
            sizes="(max-width: 430px) 50vw, 215px"
            className="object-cover transition-transform duration-500 group-active:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5" />

          {!available && (
            <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
              <Lock className="h-3.5 w-3.5 text-white" />
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 p-3.5">
            <p className="text-[15px] font-semibold leading-tight text-white">{name}</p>
            {description && (
              <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-white/80">
                {description}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ExperienceLibraryCard({
  href,
  title,
  subtitle,
  type,
  statusDot,
  index = 0,
}: {
  href: string;
  title: string;
  subtitle: string;
  type: string;
  statusDot?: "green" | "amber" | "muted";
  index?: number;
}) {
  const coverImage = getExperienceCoverImage(type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
    >
      <Link href={href} className="group block active:scale-[0.98]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-soft">
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 430px) 50vw, 215px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {statusDot && (
            <span
              className={cn(
                "absolute right-3 top-3 h-2.5 w-2.5 rounded-full ring-2 ring-white/30",
                statusDot === "green" && "bg-emerald-400",
                statusDot === "amber" && "bg-amber-400",
                statusDot === "muted" && "bg-white/50"
              )}
            />
          )}

          <div className="absolute inset-x-0 bottom-0 p-3.5">
            <p className="line-clamp-2 text-[15px] font-semibold leading-tight text-white">
              {title}
            </p>
            <p className="mt-1 line-clamp-1 text-[12px] text-white/75">{subtitle}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
