create extension if not exists pgcrypto;

create type public.workspace_role as enum ('owner','admin','member','guest');
create type public.issue_status as enum ('backlog','todo','in_progress','in_review','done','canceled');
create type public.issue_priority as enum ('none','low','medium','high','urgent');

create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text, avatar_url text, created_at timestamptz not null default now());
create table public.workspaces (id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, created_by uuid not null references public.profiles(id), created_at timestamptz not null default now());
create table public.workspace_members (workspace_id uuid references public.workspaces(id) on delete cascade, user_id uuid references public.profiles(id) on delete cascade, role public.workspace_role not null default 'member', primary key(workspace_id,user_id));
create table public.teams (id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade, name text not null, key text not null, unique(workspace_id,key));
create table public.projects (id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade, team_id uuid references public.teams(id), name text not null, description text, status text not null default 'planned', lead_id uuid references public.profiles(id), progress smallint not null default 0 check(progress between 0 and 100), start_date date, target_date date, created_at timestamptz not null default now());
create table public.cycles (id uuid primary key default gen_random_uuid(), team_id uuid not null references public.teams(id) on delete cascade, name text not null, starts_at date not null, ends_at date not null, unique(team_id,name));
create table public.issues (id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade, team_id uuid not null references public.teams(id), project_id uuid references public.projects(id), cycle_id uuid references public.cycles(id), parent_id uuid references public.issues(id), sequence bigint generated always as identity, title text not null, description text, status public.issue_status not null default 'backlog', priority public.issue_priority not null default 'none', assignee_id uuid references public.profiles(id), creator_id uuid not null references public.profiles(id), estimate smallint, due_date date, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.labels (id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade, name text not null, color text not null, unique(workspace_id,name));
create table public.issue_labels (issue_id uuid references public.issues(id) on delete cascade, label_id uuid references public.labels(id) on delete cascade, primary key(issue_id,label_id));
create table public.comments (id uuid primary key default gen_random_uuid(), issue_id uuid not null references public.issues(id) on delete cascade, author_id uuid not null references public.profiles(id), body text not null, created_at timestamptz not null default now(), edited_at timestamptz);
create table public.activities (id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade, issue_id uuid references public.issues(id) on delete cascade, actor_id uuid references public.profiles(id), action text not null, metadata jsonb not null default '{}', created_at timestamptz not null default now());
create table public.notifications (id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade, user_id uuid not null references public.profiles(id), title text not null, body text, read_at timestamptz, created_at timestamptz not null default now());

create index issues_workspace_status_idx on public.issues(workspace_id,status,updated_at desc);
create index issues_assignee_idx on public.issues(assignee_id,status);
create index comments_issue_idx on public.comments(issue_id,created_at);
create index notifications_user_idx on public.notifications(user_id,read_at,created_at desc);

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.teams enable row level security;
alter table public.projects enable row level security;
alter table public.cycles enable row level security;
alter table public.issues enable row level security;
alter table public.labels enable row level security;
alter table public.issue_labels enable row level security;
alter table public.comments enable row level security;
alter table public.activities enable row level security;
alter table public.notifications enable row level security;

create policy "profiles self read" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "workspace members read workspaces" on public.workspaces for select to authenticated using (exists(select 1 from public.workspace_members wm where wm.workspace_id=id and wm.user_id=(select auth.uid())));
create policy "members read memberships" on public.workspace_members for select to authenticated using (user_id=(select auth.uid()) or exists(select 1 from public.workspace_members mine where mine.workspace_id=workspace_id and mine.user_id=(select auth.uid())));
create policy "members read issues" on public.issues for select to authenticated using (exists(select 1 from public.workspace_members wm where wm.workspace_id=issues.workspace_id and wm.user_id=(select auth.uid())));
create policy "members create issues" on public.issues for insert to authenticated with check (creator_id=(select auth.uid()) and exists(select 1 from public.workspace_members wm where wm.workspace_id=issues.workspace_id and wm.user_id=(select auth.uid()) and wm.role in ('owner','admin','member')));
create policy "members update issues" on public.issues for update to authenticated using (exists(select 1 from public.workspace_members wm where wm.workspace_id=issues.workspace_id and wm.user_id=(select auth.uid()) and wm.role in ('owner','admin','member'))) with check (exists(select 1 from public.workspace_members wm where wm.workspace_id=issues.workspace_id and wm.user_id=(select auth.uid()) and wm.role in ('owner','admin','member')));
create policy "user reads notifications" on public.notifications for select to authenticated using (user_id=(select auth.uid()));

alter publication supabase_realtime add table public.issues, public.comments, public.notifications;
