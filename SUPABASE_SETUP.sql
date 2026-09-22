-- المسلم V65: مزامنة الحساب والإعدادات بين الأجهزة
-- نفّذ هذا الملف مرة واحدة داخل Supabase SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  role text not null default 'user',
  created_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  dark_mode boolean not null default false,
  last_surah integer,
  last_reciter text,
  last_listened_surah integer,
  settings_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_settings add column if not exists settings_json jsonb not null default '{}'::jsonb;
alter table public.user_settings add column if not exists updated_at timestamptz not null default now();

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;

drop policy if exists "profiles own select" on public.profiles;
drop policy if exists "profiles own insert" on public.profiles;
drop policy if exists "profiles own update" on public.profiles;
drop policy if exists "settings own select" on public.user_settings;
drop policy if exists "settings own insert" on public.user_settings;
drop policy if exists "settings own update" on public.user_settings;

create policy "profiles own select" on public.profiles for select using (auth.uid() = id);
create policy "profiles own insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles own update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "settings own select" on public.user_settings for select using (auth.uid() = user_id);
create policy "settings own insert" on public.user_settings for insert with check (auth.uid() = user_id);
create policy "settings own update" on public.user_settings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles(id,name) values(new.id, coalesce(new.raw_user_meta_data->>'name',''))
  on conflict (id) do update set name=excluded.name;
  insert into public.user_settings(user_id) values(new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- مهم: لأن التطبيق يستخدم اسم مستخدم داخليًا بدل البريد، عطّل Confirm email
-- من Authentication > Providers > Email في لوحة Supabase.
