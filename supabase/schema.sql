create extension if not exists "pgcrypto";

create type plan_visibility as enum ('private', 'link_view', 'link_edit');
create type member_role as enum ('owner', 'editor', 'viewer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My workspace',
  created_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role member_role not null default 'viewer',
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  visibility plan_visibility not null default 'private',
  share_token text not null unique default encode(gen_random_bytes(8), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.folders (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  name text not null,
  type text not null check (type in ('day', 'week', 'custom')),
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid not null references public.folders(id) on delete cascade,
  title text not null,
  body text not null default '',
  due_date date,
  reminder_at timestamptz,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.notes(id) on delete cascade,
  title text not null,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'urgent')),
  position int not null default 0,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.plan_invites (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  invited_email text not null,
  role member_role not null default 'viewer',
  token text not null unique default encode(gen_random_bytes(12), 'hex'),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.plans enable row level security;
alter table public.folders enable row level security;
alter table public.notes enable row level security;
alter table public.tasks enable row level security;
alter table public.plan_invites enable row level security;

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = target_workspace_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.can_view_plan(target_plan_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1
    from public.plans p
    where p.id = target_plan_id
      and (
        p.owner_id = auth.uid()
        or public.is_workspace_member(p.workspace_id)
        or p.visibility in ('link_view', 'link_edit')
      )
  );
$$;

create or replace function public.can_edit_plan(target_plan_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1
    from public.plans p
    left join public.workspace_members wm on wm.workspace_id = p.workspace_id and wm.user_id = auth.uid()
    where p.id = target_plan_id
      and (
        p.owner_id = auth.uid()
        or wm.role in ('owner', 'editor')
        or p.visibility = 'link_edit'
      )
  );
$$;

create policy "profiles are self-readable" on public.profiles
  for select to authenticated using (id = auth.uid());

create policy "profiles are self-updatable" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "workspace members can view workspaces" on public.workspaces
  for select to authenticated using (owner_id = auth.uid() or public.is_workspace_member(id));

create policy "users can create workspaces" on public.workspaces
  for insert to authenticated with check (owner_id = auth.uid());

create policy "members can view membership" on public.workspace_members
  for select to authenticated using (user_id = auth.uid() or public.is_workspace_member(workspace_id));

create policy "owners can manage membership" on public.workspace_members
  for all to authenticated using (
    exists (select 1 from public.workspaces where id = workspace_id and owner_id = auth.uid())
  );

create policy "users can view allowed plans" on public.plans
  for select using (public.can_view_plan(id));

create policy "users can create owned plans" on public.plans
  for insert to authenticated with check (owner_id = auth.uid());

create policy "editors can update plans" on public.plans
  for update using (public.can_edit_plan(id));

create policy "view folders through plans" on public.folders
  for select using (public.can_view_plan(plan_id));

create policy "edit folders through plans" on public.folders
  for all using (public.can_edit_plan(plan_id));

create policy "view notes through folders" on public.notes
  for select using (
    exists (select 1 from public.folders where folders.id = notes.folder_id and public.can_view_plan(folders.plan_id))
  );

create policy "edit notes through folders" on public.notes
  for all using (
    exists (select 1 from public.folders where folders.id = notes.folder_id and public.can_edit_plan(folders.plan_id))
  );

create policy "view tasks through notes" on public.tasks
  for select using (
    exists (
      select 1 from public.notes
      join public.folders on folders.id = notes.folder_id
      where notes.id = tasks.note_id and public.can_view_plan(folders.plan_id)
    )
  );

create policy "edit tasks through notes" on public.tasks
  for all using (
    exists (
      select 1 from public.notes
      join public.folders on folders.id = notes.folder_id
      where notes.id = tasks.note_id and public.can_edit_plan(folders.plan_id)
    )
  );
