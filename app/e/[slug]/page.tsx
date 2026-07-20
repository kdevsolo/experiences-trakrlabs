import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ExperienceRenderer } from "@/components/experiences/shared/experience-renderer";
import { ViewTracker } from "@/components/experiences/shared/analytics-client";
import { trackAnalyticsEvent } from "@/lib/actions/analytics";
import {
  getExperiencePublicMeta,
  resolveExperienceViewerAccess,
} from "@/lib/access/experience-viewer";
import { getClientIp } from "@/lib/ip";
import { getPublicExperienceUrl } from "@/lib/sharing/share-slug";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getExperiencePublicMeta(slug);
  if (!data) {
    return {
      title: "Experience not found",
      robots: { index: false, follow: false },
    };
  }

  const description =
    typeof data.config.message === "string"
      ? data.config.message.slice(0, 140)
      : `An interactive ${data.experience_type.replace(/_/g, " ")} experience`;

  return {
    title: data.title,
    description,
    openGraph: {
      title: data.title,
      description,
      type: "website",
      url: getPublicExperienceUrl(slug),
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description,
    },
  };
}

export default async function ExperienceViewerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await resolveExperienceViewerAccess(slug);

  if (result.status === "not_found") {
    notFound();
  }

  const { experience } = result;
  const requestIp = await getClientIp();

  await trackAnalyticsEvent(experience.id, "view", {
    ip: requestIp,
    userAgent: (await headers()).get("user-agent"),
  });

  return (
    <div className="relative min-h-[100dvh] bg-background">
      <ViewTracker experienceId={experience.id} />
      <ExperienceRenderer
        experienceType={experience.experience_type}
        config={experience.config}
        title={experience.title}
        experienceId={experience.id}
      />
      <footer className="pointer-events-none absolute inset-x-0 bottom-0 pb-safe">
        <Link
          href="/"
          className="pointer-events-auto mx-auto block w-fit px-5 py-4 text-[11px] text-muted-foreground/70"
        >
          Made with Experiences
        </Link>
      </footer>
    </div>
  );
}
