/**
 * Contexto global para gerenciar treinos em toda a aplicação
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { Workout } from '@/types';
import { useWorkouts } from '@/hooks/useWorkouts';

interface WorkoutContextType {
  workouts: Workout[];
  isLoaded: boolean;
  syncStatus: 'local' | 'supabase';
  addWorkout: (workout: Omit<Workout, 'id'>) => Promise<Workout>;
  updateWorkout: (id: string, updates: Partial<Workout>) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  clearAll: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const workoutHook = useWorkouts();

  return (
    <WorkoutContext.Provider value={workoutHook}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkoutContext deve ser usado dentro de WorkoutProvider');
  }
  return context;
};
