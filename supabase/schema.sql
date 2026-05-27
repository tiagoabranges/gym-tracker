create table if not exists public.workouts (
  id text primary key,
  date date not null,
  sheet text not null check (sheet in ('A', 'B', 'C')),
  exercise text not null,
  muscle_group text not null check (
    muscle_group in (
      'Peito',
      'Costas',
      'Ombros',
      'Bíceps',
      'Tríceps',
      'Pernas',
      'Panturrilha'
    )
  ),
  load numeric not null check (load >= 0),
  load_type text not null check (load_type in ('bilateral', 'unilateral')),
  reps integer not null check (reps > 0),
  sets integer not null check (sets > 0),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.workouts enable row level security;

drop policy if exists "Allow anon read workouts" on public.workouts;
drop policy if exists "Allow anon insert workouts" on public.workouts;
drop policy if exists "Allow anon update workouts" on public.workouts;
drop policy if exists "Allow anon delete workouts" on public.workouts;

create policy "Allow anon read workouts"
  on public.workouts for select
  to anon
  using (true);

create policy "Allow anon insert workouts"
  on public.workouts for insert
  to anon
  with check (true);

create policy "Allow anon update workouts"
  on public.workouts for update
  to anon
  using (true)
  with check (true);

create policy "Allow anon delete workouts"
  on public.workouts for delete
  to anon
  using (true);
