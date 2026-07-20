"use client";

import { useState } from "react";
import Link from "next/link";
import { PageTransition } from "@/components/shell/page-transition";
import { MobileShell } from "@/components/shell/mobile-shell";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { ExperienceLibraryCard } from "@/components/ui/tile-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { typeToSlug } from "@/lib/templates/registry";
import type { Draft, Experience } from "@/types/database";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LibraryClient({
  drafts,
  experiences,
}: {
  drafts: Draft[];
  experiences: Experience[];
}) {
  const [tab, setTab] = useState<"drafts" | "published">("drafts");
  const items =
    tab === "drafts"
      ? drafts.map((draft) => ({
          id: draft.id,
          href: `/create/${typeToSlug(draft.experience_type as never)}/${draft.id}`,
          title: draft.title,
          subtitle: `Edited ${formatDate(draft.updated_at)}`,
          type: draft.experience_type,
          statusDot: undefined as "green" | "amber" | "muted" | undefined,
        }))
      : experiences.map((exp) => ({
          id: exp.id,
          href: `/create/${typeToSlug(exp.experience_type as never)}/${exp.id}?published=1`,
          title: exp.title,
          subtitle:
            exp.share_unlocked && exp.share_slug
              ? "Public · share link active"
              : "Private · unlock to share",
          type: exp.experience_type,
          statusDot: (exp.share_unlocked && exp.share_slug ? "green" : "amber") as
            | "green"
            | "amber",
        }));

  return (
    <PageTransition>
      <MobileShell>
        <h1 className="text-screen-title">My work</h1>
        <p className="mt-1 text-caption">Your drafts and published experiences</p>

        <div className="mt-6">
          <SegmentedControl
            options={[
              { value: "drafts", label: "Drafts" },
              { value: "published", label: "Live" },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>

        {items.length === 0 ? (
          <div className="mt-6">
            <EmptyLibrary type={tab === "drafts" ? "drafts" : "published"} />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {items.map((item, index) => (
              <ExperienceLibraryCard
                key={item.id}
                href={item.href}
                title={item.title}
                subtitle={item.subtitle}
                type={item.type}
                statusDot={item.statusDot}
                index={index}
              />
            ))}
          </div>
        )}
      </MobileShell>
    </PageTransition>
  );
}

function EmptyLibrary({ type }: { type: "drafts" | "published" }) {
  return (
    <div className="rounded-3xl bg-surface p-8 text-center shadow-soft">
      <p className="text-4xl">{type === "drafts" ? "📝" : "✨"}</p>
      <p className="mt-3 font-medium">
        {type === "drafts" ? "No drafts yet" : "Nothing published yet"}
      </p>
      <p className="mt-1 text-caption">Create your first experience on Discover</p>
      <Link href="/" className={cn(buttonVariants({ variant: "accent" }), "mt-6 inline-flex w-full")}>
        Browse templates
      </Link>
    </div>
  );
}

export function LibrarySkeleton() {
  return (
    <MobileShell>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="mt-2 h-4 w-48" />
      <Skeleton className="mt-6 h-11 w-full rounded-2xl" />
      <div className="mt-6 grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="aspect-[4/5] w-full rounded-3xl" />
        ))}
      </div>
    </MobileShell>
  );
}
