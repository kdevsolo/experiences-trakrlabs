import { Suspense } from "react";
import { listDrafts } from "@/lib/actions/drafts";
import { listExperiences } from "@/lib/actions/experiences";
import { LibraryClient, LibrarySkeleton } from "@/components/library/library-client";

async function LibraryContent() {
  const [draftsResult, experiencesResult] = await Promise.all([
    listDrafts(),
    listExperiences(),
  ]);

  return (
    <LibraryClient
      drafts={draftsResult.data ?? []}
      experiences={experiencesResult.data ?? []}
    />
  );
}

export default function LibraryPage() {
  return (
    <Suspense fallback={<LibrarySkeleton />}>
      <LibraryContent />
    </Suspense>
  );
}
