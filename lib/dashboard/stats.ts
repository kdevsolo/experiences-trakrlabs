import { listDrafts } from "@/lib/actions/drafts";
import { listExperiences } from "@/lib/actions/experiences";

export async function getDashboardStats() {
  const [drafts, experiences] = await Promise.all([listDrafts(), listExperiences()]);
  return {
    draftCount: drafts.data?.length ?? 0,
    experienceCount: experiences.data?.length ?? 0,
    unlockedCount: experiences.data?.filter((e) => e.share_unlocked).length ?? 0,
  };
}
