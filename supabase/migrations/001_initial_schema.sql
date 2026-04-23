-- Breaking Time — Initial Schema
-- Run via: supabase db push

-- ─────────────────────────────────────────────
-- EXTENSIONS
-- ─────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────
create table public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text not null unique,
  avatar_url   text,
  created_at   timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can read all profiles"
  on public.users for select using (true);

create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert with check (auth.uid() = id);

-- ─────────────────────────────────────────────
-- GROUPS
-- ─────────────────────────────────────────────
create table public.groups (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  invite_code      text not null unique,
  created_by       uuid not null references public.users(id),
  competition_type text not null default 'daily' check (competition_type in ('daily', 'weekly')),
  created_at       timestamptz not null default now()
);

alter table public.groups enable row level security;

create policy "Group members can read group"
  on public.groups for select using (
    exists (
      select 1 from public.group_members
      where group_id = groups.id and user_id = auth.uid()
    )
  );

create policy "Authenticated users can create groups"
  on public.groups for insert with check (auth.uid() = created_by);

-- ─────────────────────────────────────────────
-- GROUP MEMBERS
-- ─────────────────────────────────────────────
create table public.group_members (
  group_id   uuid not null references public.groups(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  joined_at  timestamptz not null default now(),
  primary key (group_id, user_id)
);

alter table public.group_members enable row level security;

create policy "Members can read group membership"
  on public.group_members for select using (
    exists (
      select 1 from public.group_members gm
      where gm.group_id = group_members.group_id and gm.user_id = auth.uid()
    )
  );

create policy "Authenticated users can join groups"
  on public.group_members for insert with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- USAGE REPORTS
-- ─────────────────────────────────────────────
create table public.usage_reports (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users(id) on delete cascade,
  reported_at    timestamptz not null default now(),
  period_start   timestamptz not null,
  period_end     timestamptz not null,
  total_junk_ms  bigint not null default 0,
  app_breakdown  jsonb not null default '{}',
  tracked_apps   text[] not null default '{}'
);

alter table public.usage_reports enable row level security;

create policy "Users can read own reports"
  on public.usage_reports for select using (auth.uid() = user_id);

create policy "Group members can read each other reports"
  on public.usage_reports for select using (
    exists (
      select 1 from public.group_members gm1
      join public.group_members gm2 on gm1.group_id = gm2.group_id
      where gm1.user_id = auth.uid() and gm2.user_id = usage_reports.user_id
    )
  );

create policy "Users can insert own reports"
  on public.usage_reports for insert with check (auth.uid() = user_id);

create index on public.usage_reports (user_id, period_start desc);

-- ─────────────────────────────────────────────
-- BADGES
-- ─────────────────────────────────────────────
create table public.badges (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  badge_key  text not null,
  group_id   uuid references public.groups(id) on delete set null,
  earned_at  timestamptz not null default now()
);

alter table public.badges enable row level security;

create policy "Anyone can read badges"
  on public.badges for select using (true);

create policy "Server can insert badges"
  on public.badges for insert with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- REACTIONS
-- ─────────────────────────────────────────────
create table public.reactions (
  id           uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references public.users(id) on delete cascade,
  to_user_id   uuid not null references public.users(id) on delete cascade,
  group_id     uuid not null references public.groups(id) on delete cascade,
  type         text not null check (type in ('skull', 'clap', 'clown', 'pressed')),
  created_at   timestamptz not null default now()
);

alter table public.reactions enable row level security;

create policy "Group members can read reactions"
  on public.reactions for select using (
    exists (
      select 1 from public.group_members
      where group_id = reactions.group_id and user_id = auth.uid()
    )
  );

create policy "Authenticated users can send reactions"
  on public.reactions for insert with check (auth.uid() = from_user_id);

-- ─────────────────────────────────────────────
-- TAUNTS
-- ─────────────────────────────────────────────
create table public.taunts (
  id           uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references public.users(id) on delete cascade,
  to_user_id   uuid not null references public.users(id) on delete cascade,
  group_id     uuid not null references public.groups(id) on delete cascade,
  message_key  text not null,
  created_at   timestamptz not null default now()
);

alter table public.taunts enable row level security;

create policy "Group members can read taunts"
  on public.taunts for select using (
    exists (
      select 1 from public.group_members
      where group_id = taunts.group_id and user_id = auth.uid()
    )
  );

create policy "Authenticated users can send taunts"
  on public.taunts for insert with check (auth.uid() = from_user_id);

-- ─────────────────────────────────────────────
-- GROUP CHALLENGES
-- ─────────────────────────────────────────────
create table public.group_challenges (
  id               uuid primary key default gen_random_uuid(),
  group_id         uuid not null references public.groups(id) on delete cascade,
  type             text not null,
  multiplier_app   text,
  starts_at        timestamptz not null,
  ends_at          timestamptz not null,
  created_by       uuid not null references public.users(id)
);

alter table public.group_challenges enable row level security;

create policy "Group members can read challenges"
  on public.group_challenges for select using (
    exists (
      select 1 from public.group_members
      where group_id = group_challenges.group_id and user_id = auth.uid()
    )
  );

create policy "Group members can create challenges"
  on public.group_challenges for insert with check (auth.uid() = created_by);

-- ─────────────────────────────────────────────
-- STREAKS
-- ─────────────────────────────────────────────
create table public.streaks (
  user_id               uuid not null references public.users(id) on delete cascade,
  group_id              uuid not null references public.groups(id) on delete cascade,
  win_streak_count      int not null default 0,
  personal_streak_count int not null default 0,
  last_updated          timestamptz not null default now(),
  primary key (user_id, group_id)
);

alter table public.streaks enable row level security;

create policy "Group members can read streaks"
  on public.streaks for select using (
    exists (
      select 1 from public.group_members
      where group_id = streaks.group_id and user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────
-- CUSTOM NOTIFICATIONS
-- ─────────────────────────────────────────────
create table public.custom_notifications (
  id             uuid primary key default gen_random_uuid(),
  group_id       uuid not null references public.groups(id) on delete cascade,
  author_id      uuid not null references public.users(id) on delete cascade,
  template       text not null check (char_length(template) <= 140),
  status         text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  votes_for      int not null default 0,
  votes_against  int not null default 0,
  created_at     timestamptz not null default now()
);

alter table public.custom_notifications enable row level security;

create policy "Group members can read custom notifications"
  on public.custom_notifications for select using (
    exists (
      select 1 from public.group_members
      where group_id = custom_notifications.group_id and user_id = auth.uid()
    )
  );

create policy "Group members can submit custom notifications"
  on public.custom_notifications for insert with check (
    auth.uid() = author_id and
    exists (
      select 1 from public.group_members
      where group_id = custom_notifications.group_id and user_id = auth.uid()
    )
  );

create table public.custom_notification_votes (
  notification_id  uuid not null references public.custom_notifications(id) on delete cascade,
  user_id          uuid not null references public.users(id) on delete cascade,
  vote             boolean not null,
  primary key (notification_id, user_id)
);

alter table public.custom_notification_votes enable row level security;

create policy "Group members can vote"
  on public.custom_notification_votes for insert with check (auth.uid() = user_id);

create policy "Group members can read votes"
  on public.custom_notification_votes for select using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- YARD TREES (Neighborhood mechanic)
-- ─────────────────────────────────────────────
create table public.yard_trees (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  tree_type   text not null default 'sprout' check (tree_type in ('sprout', 'bush', 'oak', 'blossom', 'ancient')),
  planted_at  timestamptz not null default now(),
  is_dead     boolean not null default false,
  died_at     timestamptz
);

alter table public.yard_trees enable row level security;

create policy "Anyone can read yard trees"
  on public.yard_trees for select using (true);

create policy "Users can insert own trees"
  on public.yard_trees for insert with check (auth.uid() = user_id);

create policy "Users can update own trees"
  on public.yard_trees for update using (auth.uid() = user_id);

create index on public.yard_trees (user_id, planted_at desc);

-- ─────────────────────────────────────────────
-- NEIGHBORHOOD BUILDINGS (collective unlocks)
-- ─────────────────────────────────────────────
create table public.neighborhood_buildings (
  id             uuid primary key default gen_random_uuid(),
  group_id       uuid not null references public.groups(id) on delete cascade,
  building_type  text not null,
  unlocked_at    timestamptz not null default now()
);

alter table public.neighborhood_buildings enable row level security;

create policy "Group members can read buildings"
  on public.neighborhood_buildings for select using (
    exists (
      select 1 from public.group_members
      where group_id = neighborhood_buildings.group_id and user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────
-- GROUP DONATIONS (real-world impact tracking)
-- ─────────────────────────────────────────────
create table public.group_donations (
  id                 uuid primary key default gen_random_uuid(),
  group_id           uuid not null references public.groups(id) on delete cascade,
  charity_key        text not null,
  trees_contributed  int not null default 0,
  milestone_reached  int not null,
  donated_at         timestamptz not null default now()
);

alter table public.group_donations enable row level security;

create policy "Group members can read donations"
  on public.group_donations for select using (
    exists (
      select 1 from public.group_members
      where group_id = group_donations.group_id and user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────
-- REALTIME
-- Enable realtime on tables that need live updates
-- ─────────────────────────────────────────────
alter publication supabase_realtime add table public.usage_reports;
alter publication supabase_realtime add table public.reactions;
alter publication supabase_realtime add table public.taunts;
alter publication supabase_realtime add table public.streaks;
alter publication supabase_realtime add table public.yard_trees;
alter publication supabase_realtime add table public.neighborhood_buildings;
