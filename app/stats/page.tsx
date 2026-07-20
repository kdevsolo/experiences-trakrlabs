import { PageTransition } from "@/components/shell/page-transition";
import { MobileShell } from "@/components/shell/mobile-shell";
import { StatHero } from "@/components/ui/stat-hero";
import { ListRow } from "@/components/ui/list-row";
import { getDashboardAnalytics } from "@/lib/actions/analytics";

export default async function StatsPage() {
  const { data } = await getDashboardAnalytics();

  return (
    <PageTransition>
      <MobileShell>
        <h1 className="text-screen-title">Stats</h1>
        <div className="mt-6">
          <StatHero value={data?.totalViews ?? 0} label="Total views" />
        </div>
        <div className="mt-8 space-y-3">
          {data?.experiences?.length ? (
            data.experiences.map((exp) => (
              <ListRow
                key={exp.id}
                title={exp.title}
                subtitle={
                  exp.share_unlocked && exp.share_slug
                    ? `Public · /e/${exp.share_slug}`
                    : "Private · not shared yet"
                }
                trailing={<span className="text-sm font-semibold">{exp.views}</span>}
              />
            ))
          ) : (
            <p className="text-center text-caption py-8">
              Views appear here after you unlock public sharing
            </p>
          )}
        </div>
      </MobileShell>
    </PageTransition>
  );
}
