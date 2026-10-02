-- المسلم: minimal cloud sync table
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings_json jsonb not null default '{}'::jsonb,
  dark_mode boolean default false,
  last_surah integer,
  last_reciter text,
  last_listened_surah integer,
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

drop policy if exists "users read own settings" on public.user_settings;
create policy "users read own settings" on public.user_settings
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "users insert own settings" on public.user_settings;
create policy "users insert own settings" on public.user_settings
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "users update own settings" on public.user_settings;
create policy "users update own settings" on public.user_settings
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
