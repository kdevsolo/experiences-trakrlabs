"use client";

import { useState } from "react";
import Image from "next/image";
import { listExperienceOfferings, typeToSlug } from "@/lib/templates/registry";
import { getExperienceCoverImage } from "@/lib/templates/cover-images";
import { TileCard } from "@/components/ui/tile-card";
import { PageTransition } from "@/components/shell/page-transition";
import { MobileShell } from "@/components/shell/mobile-shell";
import { AuthSheet } from "@/components/auth/auth-sheet";
import Link from "next/link";

export function OfferingsGrid({
  showLoginPrompt = false,
  returnPath = "/library",
}: {
  showLoginPrompt?: boolean;
  returnPath?: string;
}) {
  const offerings = listExperienceOfferings();
  const [authOpen, setAuthOpen] = useState(showLoginPrompt);

  const featured = offerings.filter((o) =>
    ["digital_card", "apology_letter"].includes(o.type)
  );
  const rest = offerings.filter(
    (o) => !["digital_card", "apology_letter"].includes(o.type)
  );

  return (
    <PageTransition>
      <MobileShell className="pt-4">
        <div className="mb-6">
          <p className="text-[15px] text-muted-foreground">
            Create & share moments
          </p>
        </div>

        {featured.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-section">Featured</h2>
            <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 snap-x snap-mandatory">
              {featured.map((offering, index) => (
                <FeaturedCard
                  key={offering.type}
                  href={`/create/${typeToSlug(offering.type)}`}
                  name={offering.name}
                  description={offering.description}
                  type={offering.type}
                  available={offering.available}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-3 text-section">All templates</h2>
          <div className="grid grid-cols-2 gap-3">
            {rest.map((offering, index) => (
              <TileCard
                key={offering.type}
                href={`/create/${typeToSlug(offering.type)}`}
                name={offering.name}
                description={offering.description}
                type={offering.type}
                available={offering.available}
                index={index}
              />
            ))}
          </div>
        </section>

        <p className="mt-8 text-center text-caption">
          Tap a template to start creating
        </p>
      </MobileShell>

      <AuthSheet
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        returnPath={returnPath}
        title={showLoginPrompt ? "Sign in to continue" : "Save your work"}
      />
    </PageTransition>
  );
}

function FeaturedCard({
  href,
  name,
  description,
  type,
  available,
  index,
}: {
  href: string;
  name: string;
  description: string;
  type: string;
  available: boolean;
  index: number;
}) {
  const coverImage = getExperienceCoverImage(type);

  if (!available) return null;

  return (
    <Link
      href={href}
      className="group relative h-52 w-[78%] shrink-0 snap-center overflow-hidden rounded-3xl shadow-soft active:scale-[0.98]"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <Image
        src={coverImage}
        alt={name}
        fill
        sizes="320px"
        priority={index === 0}
        className="object-cover transition-transform duration-500 group-active:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-lg font-semibold text-white">{name}</p>
        <p className="mt-1 line-clamp-2 text-sm text-white/80">{description}</p>
      </div>
    </Link>
  );
}
