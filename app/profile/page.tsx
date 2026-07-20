import { createClient } from "@/lib/supabase/server";
import { ProfileClient } from "@/components/profile/profile-client";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ spotify?: string; reason?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { spotify, reason } = await searchParams;

  const { data: connection } = user
    ? await supabase
        .from("music_connections")
        .select("id")
        .eq("user_id", user.id)
        .eq("provider", "spotify")
        .maybeSingle()
    : { data: null };

  return (
    <ProfileClient
      email={user?.email}
      name={user?.user_metadata?.full_name ?? user?.user_metadata?.name}
      userId={user?.id}
      spotifyConnected={Boolean(connection)}
      spotifyStatus={spotify}
      spotifyErrorReason={reason}
    />
  );
}
