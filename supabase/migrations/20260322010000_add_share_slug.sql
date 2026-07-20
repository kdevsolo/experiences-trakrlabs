-- Public share links use share_slug, issued only after payment unlock.
-- The internal publish slug must never grant public access.

alter table public.experiences
  add column if not exists share_slug text unique;

create index if not exists experiences_share_slug_idx on public.experiences(share_slug);

-- Undo dev/auto unlocks that never completed payment.
update public.experiences e
set share_unlocked = false,
    share_slug = null
where e.share_unlocked = true
  and not exists (
    select 1
    from public.payments p
    where p.experience_id = e.id
      and p.status = 'completed'
  );

-- Issue fresh public tokens only for legitimately paid experiences.
update public.experiences
set share_slug = substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)
where share_unlocked = true
  and share_slug is null;
