-- Interactive Experiences Platform schema

create extension if not exists "pgcrypto";

create type public.experience_status as enum ('published', 'archived');
create type public.payment_status as enum ('pending', 'completed', 'failed');
create type public.analytics_event_type as enum ('view', 'open', 'click', 'share', 'accept_apology');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  email text,
  created_at timestamptz not null default now()
);

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  type text not null,
  description text,
  thumbnail_url text,
  default_config jsonb not null default '{}'::jsonb,
  editor_schema jsonb,
  sort_order int not null default 0,
  available boolean not null default false
);

create table public.themes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tokens jsonb not null default '{}'::jsonb,
  preview_url text
);

create table public.drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid references public.templates(id) on delete set null,
  theme_id uuid references public.themes(id) on delete set null,
  experience_type text not null,
  title text not null default 'Untitled',
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid references public.templates(id) on delete set null,
  theme_id uuid references public.themes(id) on delete set null,
  experience_type text not null,
  title text not null,
  slug text unique not null,
  config jsonb not null default '{}'::jsonb,
  status public.experience_status not null default 'published',
  creator_ip inet,
  share_unlocked boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  experience_id uuid not null references public.experiences(id) on delete cascade,
  provider text not null default 'dodo',
  provider_payment_id text,
  amount_inr int not null default 1000,
  status public.payment_status not null default 'pending',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.experience_assets (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  storage_path text not null,
  asset_type text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.analytics (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  event_type public.analytics_event_type not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.music_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'spotify',
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, provider)
);

create index drafts_user_id_idx on public.drafts(user_id);
create index experiences_user_id_idx on public.experiences(user_id);
create index experiences_slug_idx on public.experiences(slug);
create index payments_experience_id_idx on public.payments(experience_id);
create index analytics_experience_id_idx on public.analytics(experience_id);

alter table public.profiles enable row level security;
alter table public.templates enable row level security;
alter table public.themes enable row level security;
alter table public.drafts enable row level security;
alter table public.experiences enable row level security;
alter table public.payments enable row level security;
alter table public.experience_assets enable row level security;
alter table public.analytics enable row level security;
alter table public.music_connections enable row level security;

create policy "Public read templates" on public.templates for select using (true);
create policy "Public read themes" on public.themes for select using (true);

create policy "Users manage own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users manage own drafts" on public.drafts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own experiences" on public.experiences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Public read published experiences" on public.experiences
  for select using (status = 'published');

create policy "Users read own payments" on public.payments
  for select using (auth.uid() = user_id);

create policy "Users manage own music connections" on public.music_connections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Anyone can insert analytics" on public.analytics
  for insert with check (true);

create policy "Owners read analytics" on public.analytics
  for select using (
    exists (
      select 1 from public.experiences e
      where e.id = experience_id and e.user_id = auth.uid()
    )
  );

create policy "Owners manage experience assets" on public.experience_assets
  for all using (
    exists (
      select 1 from public.experiences e
      where e.id = experience_id and e.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.experiences e
      where e.id = experience_id and e.user_id = auth.uid()
    )
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger drafts_updated_at before update on public.drafts
  for each row execute procedure public.set_updated_at();

create trigger experiences_updated_at before update on public.experiences
  for each row execute procedure public.set_updated_at();
