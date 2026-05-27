/**
 * Utilitários para cálculos de volume, estatísticas e sugestões
 */

import { LoadType, Workout, WorkoutStats, Suggestion } from '@/types';



export const getTotalLoad = (
  load: number,
  loadType: LoadType = 'unilateral'
): number => {
  return loadType === 'bilateral' ? load * 2 : load;
};

export const getLoadTypeLabel = (loadType: LoadType): string => {
  return loadType === 'bilateral' ? 'por lado' : 'total';
};

export const formatLoad = (load: number, loadType: LoadType): string => {
  return loadType === 'bilateral' ? `${load} kg por lado` : `${load} kg total`;
};

/**
 * Calcula o volume total de um treino.
 * Volume = carga total movimentada * repetições * séries.
 * Se for por lado, multiplica a carga por 2.
 */
export const calculateVolume = (
  load: number,
  reps: number,
  sets: number,
  loadType: LoadType = 'unilateral'
): number => {
  return getTotalLoad(load, loadType) * reps * sets;
};

/**
 * Calcula estatísticas gerais dos treinos
 */
export const calculateStats = (workouts: Workout[]): WorkoutStats => {
  if (workouts.length === 0) {
    return {
      totalWorkouts: 0,
      totalVolume: 0,
      maxLoad: 0,
      mostTrainedExercise: null,
    };
  }

  const totalWorkouts = workouts.length;
  const totalVolume = workouts.reduce((sum, w) => sum + calculateVolume(w.load, w.reps, w.sets, w.loadType), 0);
  const maxLoad = Math.max(...workouts.map(w => getTotalLoad(w.load, w.loadType)));

  // Exercício mais treinado (maior frequência)
  const exerciseFrequency: Record<string, number> = {};
  workouts.forEach(w => {
    exerciseFrequency[w.exercise] = (exerciseFrequency[w.exercise] || 0) + 1;
  });

  const mostTrainedExercise = Object.entries(exerciseFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    totalWorkouts,
    totalVolume,
    maxLoad,
    mostTrainedExercise,
  };
};

/**
 * Retorna o volume total acumulado de um exercício específico
 */
export const getTotalVolumeByExercise = (workouts: Workout[], exerciseName: string): number => {
  return workouts
    .filter(w => w.exercise === exerciseName)
    .reduce((sum, w) => sum + calculateVolume(w.load, w.reps, w.sets, w.loadType), 0);
};

/**
 * Retorna o volume total acumulado por grupo muscular
 */
export const getVolumeByMuscleGroup = (workouts: Workout[]): Record<string, number> => {
  const volumeByMuscle: Record<string, number> = {};

  workouts.forEach(w => {
    const volume = calculateVolume(w.load, w.reps, w.sets, w.loadType);
    volumeByMuscle[w.muscleGroup] = (volumeByMuscle[w.muscleGroup] || 0) + volume;
  });

  return volumeByMuscle;
};

/**
 * Retorna o histórico de evolução de um exercício específico
 */
export const getExerciseEvolution = (workouts: Workout[], exerciseName: string) => {
  return workouts
    .filter(w => w.exercise === exerciseName)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(w => ({
      date: w.date,
      load: getTotalLoad(w.load, w.loadType),
      reps: w.reps,
      sets: w.sets,
      volume: calculateVolume(w.load, w.reps, w.sets, w.loadType),
    }));
};

/**
 * Retorna a evolução de volume por treino (ordenado por data)
 */
export const getVolumeEvolution = (workouts: Workout[]) => {
  const volumeByDate: Record<string, number> = {};

  workouts.forEach(w => {
    const volume = calculateVolume(w.load, w.reps, w.sets, w.loadType);
    volumeByDate[w.date] = (volumeByDate[w.date] || 0) + volume;
  });

  return Object.entries(volumeByDate)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([date, volume]) => ({ date, volume }));
};

/**
 * Gera sugestões baseadas nas regras definidas
 * Regras:
 * 1. Se exercício teve 2 treinos seguidos com 10+ reps → aumentar carga
 * 2. Se exercício teve queda de reps em 2 treinos seguidos → manter carga ou revisar descanso
 * 3. Se exercício ficou 4 treinos sem evolução → trocar variação ou ajustar técnica
 */
export const generateSuggestions = (workouts: Workout[]): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  const exerciseHistory: Record<string, Workout[]> = {};

  // Agrupar treinos por exercício
  workouts.forEach(w => {
    if (!exerciseHistory[w.exercise]) {
      exerciseHistory[w.exercise] = [];
    }
    exerciseHistory[w.exercise].push(w);
  });

  // Analisar cada exercício
  Object.entries(exerciseHistory).forEach(([exerciseName, history]) => {
    if (history.length < 2) return;

    // Ordenar por data
    const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Regra 1: 2 treinos seguidos com 10+ reps
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].reps >= 10 && sorted[i + 1].reps >= 10) {
        suggestions.push({
          exerciseName,
          type: 'increase_load',
          message: `${exerciseName}: Você conseguiu 10+ repetições em 2 treinos seguidos! Considere aumentar a carga.`,
        });
        break;
      }
    }

    // Regra 2: Queda de reps em 2 treinos seguidos
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].reps > sorted[i + 1].reps) {
        suggestions.push({
          exerciseName,
          type: 'maintain_load',
          message: `${exerciseName}: Queda de repetições detectada. Mantenha a carga e revise seu descanso.`,
        });
        break;
      }
    }

    // Regra 3: 4 treinos sem evolução (mesma carga)
    if (sorted.length >= 4) {
      const lastFour = sorted.slice(-4);
      const allSameLoad = lastFour.every(w => w.load === lastFour[0].load);
      if (allSameLoad) {
        suggestions.push({
          exerciseName,
          type: 'change_variation',
          message: `${exerciseName}: Sem evolução há 4 treinos. Considere trocar a variação ou ajustar a técnica.`,
        });
      }
    }
  });

  return suggestions;
};

/**
 * Calcula a evolução de carga de um exercício
 * Retorna: carga inicial, carga final, diferença e período
 */
export interface LoadEvolution {
  exerciseName: string;
  initialLoad: number;
  finalLoad: number;
  difference: number;
  percentageChange: number;
  initialDate: string;
  finalDate: string;
  daysElapsed: number;
}

export const getLoadEvolution = (workouts: Workout[]): LoadEvolution[] => {
  const exerciseHistory: Record<string, Array<{ load: number; date: string }>> = {};

  // Agrupar treinos por exercício e ordenar por data
  workouts.forEach(w => {
    const displayLoad = getTotalLoad(w.load, w.loadType);
    if (!exerciseHistory[w.exercise]) {
      exerciseHistory[w.exercise] = [];
    }
    exerciseHistory[w.exercise].push({
      load: displayLoad,
      date: w.date,
    });
  });

  // Calcular evolução para cada exercício
  const evolutions: LoadEvolution[] = [];
  Object.entries(exerciseHistory).forEach(([exerciseName, history]) => {
    if (history.length < 2) return; // Precisa de pelo menos 2 registros

    // Ordenar por data
    const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const initialLoad = sorted[0].load;
    const finalLoad = sorted[sorted.length - 1].load;
    const difference = finalLoad - initialLoad;
    const percentageChange = (difference / initialLoad) * 100;

    const initialDate = sorted[0].date;
    const finalDate = sorted[sorted.length - 1].date;
    const daysElapsed = Math.floor(
      (new Date(finalDate).getTime() - new Date(initialDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    evolutions.push({
      exerciseName,
      initialLoad,
      finalLoad,
      difference,
      percentageChange,
      initialDate,
      finalDate,
      daysElapsed,
    });
  });

  // Ordenar por diferença (maior evolução primeiro)
  return evolutions.sort((a, b) => b.difference - a.difference);
};

/**
 * Formata data para exibição (DD/MM/YYYY)
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

/**
 * Formata data para input HTML (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
