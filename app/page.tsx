import { createClient } from "@/lib/supabase/server";
import { OfferingsGrid } from "@/components/offerings/offerings-grid";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ login?: string; next?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { login, next } = await searchParams;

  return (
    <OfferingsGrid
      showLoginPrompt={login === "required" && !user}
      returnPath={next && next.startsWith("/") ? next : "/library"}
    />
  );
}
