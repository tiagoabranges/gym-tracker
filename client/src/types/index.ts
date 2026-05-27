/**
 * Tipos centralizados para a aplicação Gym Tracker
 * Definem as estruturas de dados para treinos, exercícios e métricas
 */

export type SheetType = 'A' | 'B' | 'C';

export type MuscleGroup = 
  | 'Peito'
  | 'Costas'
  | 'Ombros'
  | 'Bíceps'
  | 'Tríceps'
  | 'Pernas'
  | 'Panturrilha';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sheets: SheetType[];
}

export type LoadType = 'unilateral' | 'bilateral';
export type LoadMode = 'total' | 'per_side';

export interface Workout {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  sheet: SheetType;
  exercise: string; // exercise name
  muscleGroup: MuscleGroup;
  load: number; // kg informed by the user
  loadType: LoadType; // legacy: bilateral = per_side, unilateral = total
  reps: number;
  sets: number;
  notes?: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalVolume: number;
  maxLoad: number;
  mostTrainedExercise: string | null;
}

export interface ExerciseEvolution {
  date: string;
  load: number;
  reps: number;
  sets: number;
  volume: number;
}

export interface Suggestion {
  exerciseName: string;
  type: 'increase_load' | 'maintain_load' | 'change_variation';
  message: string;
}
