-- Only allow public reads for experiences that have paid sharing unlocked.
-- Owners can still read their own experiences via existing owner policies.

drop policy if exists "Public read published experiences" on public.experiences;

create policy "Public read unlocked experiences" on public.experiences
  for select using (status = 'published' and share_unlocked = true);
