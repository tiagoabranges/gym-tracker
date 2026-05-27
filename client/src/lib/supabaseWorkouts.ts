import { Workout } from '@/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

type SupabaseWorkout = {
  id: string;
  date: string;
  sheet: Workout['sheet'];
  exercise: string;
  muscle_group: Workout['muscleGroup'];
  load: number;
  load_type: Workout['loadType'];
  reps: number;
  sets: number;
  notes: string | null;
};

const toWorkout = (row: SupabaseWorkout): Workout => ({
  id: row.id,
  date: row.date,
  sheet: row.sheet,
  exercise: row.exercise,
  muscleGroup: row.muscle_group,
  load: Number(row.load),
  loadType: row.load_type,
  reps: row.reps,
  sets: row.sets,
  notes: row.notes || undefined,
});

const toSupabaseWorkout = (workout: Workout): SupabaseWorkout => ({
  id: workout.id,
  date: workout.date,
  sheet: workout.sheet,
  exercise: workout.exercise,
  muscle_group: workout.muscleGroup,
  load: workout.load,
  load_type: workout.loadType,
  reps: workout.reps,
  sets: workout.sets,
  notes: workout.notes || null,
});

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase não configurado');
  }

  const response = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Erro ao comunicar com Supabase');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const listWorkouts = async (): Promise<Workout[]> => {
  const rows = await request<SupabaseWorkout[]>('workouts?select=*&order=date.desc');
  return rows.map(toWorkout);
};

export const createWorkout = async (workout: Workout): Promise<Workout> => {
  const rows = await request<SupabaseWorkout[]>('workouts', {
    method: 'POST',
    body: JSON.stringify(toSupabaseWorkout(workout)),
  });
  return toWorkout(rows[0]);
};

export const updateWorkout = async (
  id: string,
  updates: Partial<Workout>
): Promise<Workout> => {
  const current = Object.fromEntries(
    Object.entries(updates).map(([key, value]) => {
      if (key === 'muscleGroup') return ['muscle_group', value];
      if (key === 'loadType') return ['load_type', value];
      return [key, value];
    })
  );

  const rows = await request<SupabaseWorkout[]>(`workouts?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(current),
  });
  return toWorkout(rows[0]);
};

export const deleteWorkout = async (id: string): Promise<void> => {
  await request<void>(`workouts?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Prefer: 'return=minimal' },
  });
};
