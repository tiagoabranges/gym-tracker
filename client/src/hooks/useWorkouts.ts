import { useState, useEffect, useCallback } from 'react';
import { Workout } from '@/types';
import { nanoid } from 'nanoid';
import {
  createWorkout,
  deleteWorkout as deleteSupabaseWorkout,
  isSupabaseConfigured,
  listWorkouts,
  updateWorkout as updateSupabaseWorkout,
} from '@/lib/supabaseWorkouts';

const STORAGE_KEY = 'gym-tracker-workouts';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'local' | 'supabase'>(
    isSupabaseConfigured ? 'supabase' : 'local'
  );

  const readLocalWorkouts = (): Workout[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    try {
      return JSON.parse(stored) as Workout[];
    } catch (error) {
      console.error('Erro ao carregar treinos locais:', error);
      return [];
    }
  };

  const saveLocalWorkouts = (items: Workout[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        if (isSupabaseConfigured) {
          const remoteWorkouts = await listWorkouts();
          const localWorkouts = readLocalWorkouts();
          if (remoteWorkouts.length === 0 && localWorkouts.length > 0) {
            const migratedWorkouts = await Promise.all(
              localWorkouts.map(workout => createWorkout(workout))
            );
            if (!isMounted) return;
            setWorkouts(migratedWorkouts);
            saveLocalWorkouts(migratedWorkouts);
            setSyncStatus('supabase');
            return;
          }

          if (!isMounted) return;
          setWorkouts(remoteWorkouts);
          saveLocalWorkouts(remoteWorkouts);
          setSyncStatus('supabase');
          return;
        }
      } catch (error) {
        console.error('Erro ao carregar treinos do Supabase:', error);
        setSyncStatus('local');
      }

      if (!isMounted) return;
      setWorkouts(readLocalWorkouts());
      setIsLoaded(true);
    };

    load().finally(() => {
      if (isMounted) setIsLoaded(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveLocalWorkouts(workouts);
    }
  }, [workouts, isLoaded]);

  const addWorkout = useCallback(async (workout: Omit<Workout, 'id'>) => {
    const newWorkout: Workout = {
      ...workout,
      id: nanoid(),
    };

    setWorkouts(prev => [...prev, newWorkout]);
    if (isSupabaseConfigured) {
      try {
        const saved = await createWorkout(newWorkout);
        setWorkouts(prev => prev.map(w => (w.id === newWorkout.id ? saved : w)));
        setSyncStatus('supabase');
      } catch (error) {
        console.error('Erro ao salvar no Supabase:', error);
        setSyncStatus('local');
      }
    }

    return newWorkout;
  }, []);

  const updateWorkout = useCallback(async (id: string, updates: Partial<Workout>) => {
    setWorkouts(prev =>
      prev.map(w => (w.id === id ? { ...w, ...updates } : w))
    );

    if (isSupabaseConfigured) {
      try {
        const saved = await updateSupabaseWorkout(id, updates);
        setWorkouts(prev => prev.map(w => (w.id === id ? saved : w)));
        setSyncStatus('supabase');
      } catch (error) {
        console.error('Erro ao atualizar no Supabase:', error);
        setSyncStatus('local');
      }
    }
  }, []);

  const deleteWorkout = useCallback(async (id: string) => {
    const previous = workouts;
    setWorkouts(prev => prev.filter(w => w.id !== id));

    if (isSupabaseConfigured) {
      try {
        await deleteSupabaseWorkout(id);
        setSyncStatus('supabase');
      } catch (error) {
        console.error('Erro ao deletar no Supabase:', error);
        setWorkouts(previous);
        setSyncStatus('local');
      }
    }
  }, [workouts]);

  const clearAll = useCallback(() => {
    setWorkouts([]);
  }, []);

  return {
    workouts,
    isLoaded,
    syncStatus,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    clearAll,
  };
};
