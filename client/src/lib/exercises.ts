/**
 * Exercícios base organizados por ficha (A, B, C)
 * Cada exercício inclui seu grupo muscular
 */

import { Exercise, SheetType } from '@/types';

export const EXERCISES_BY_SHEET: Record<SheetType, Exercise[]> = {
  A: [
    { id: 'a1', name: 'Supino reto com barra', muscleGroup: 'Peito', sheets: ['A'] },
    { id: 'a2', name: 'Supino inclinado com halteres', muscleGroup: 'Peito', sheets: ['A'] },
    { id: 'a3', name: 'Crucifixo na máquina', muscleGroup: 'Peito', sheets: ['A'] },
    { id: 'a4', name: 'Cross over', muscleGroup: 'Peito', sheets: ['A'] },
    { id: 'a5', name: 'Tríceps testa', muscleGroup: 'Tríceps', sheets: ['A'] },
    { id: 'a6', name: 'Tríceps cross', muscleGroup: 'Tríceps', sheets: ['A'] },
    { id: 'a7', name: 'Tríceps francês', muscleGroup: 'Tríceps', sheets: ['A'] },
    { id: 'a8', name: 'Elevação lateral', muscleGroup: 'Ombros', sheets: ['A'] },
    { id: 'a9', name: 'Elevação frontal', muscleGroup: 'Ombros', sheets: ['A'] },
  ],
  B: [
    { id: 'b1', name: 'Puxada frente pulley', muscleGroup: 'Costas', sheets: ['B'] },
    { id: 'b2', name: 'Remada no pulley', muscleGroup: 'Costas', sheets: ['B'] },
    { id: 'b3', name: 'Remada articulada', muscleGroup: 'Costas', sheets: ['B'] },
    { id: 'b4', name: 'Crucifixo inverso', muscleGroup: 'Ombros', sheets: ['B'] },
    { id: 'b5', name: 'Rosca W', muscleGroup: 'Bíceps', sheets: ['B'] },
    { id: 'b6', name: 'Rosca 45 no banco', muscleGroup: 'Bíceps', sheets: ['B'] },
    { id: 'b7', name: 'Rosca martelo', muscleGroup: 'Bíceps', sheets: ['B'] },
    { id: 'b8', name: 'Rosca inversa', muscleGroup: 'Bíceps', sheets: ['B'] },
  ],
  C: [
    { id: 'c1', name: 'Agachamento', muscleGroup: 'Pernas', sheets: ['C'] },
    { id: 'c2', name: 'Leg press 45', muscleGroup: 'Pernas', sheets: ['C'] },
    { id: 'c3', name: 'Cadeira extensora', muscleGroup: 'Pernas', sheets: ['C'] },
    { id: 'c4', name: 'Mesa flexora', muscleGroup: 'Pernas', sheets: ['C'] },
    { id: 'c5', name: 'Stiff', muscleGroup: 'Pernas', sheets: ['C'] },
    { id: 'c6', name: 'Panturrilha em pé', muscleGroup: 'Panturrilha', sheets: ['C'] },
  ],
};

export const ALL_EXERCISES: Exercise[] = [
  ...EXERCISES_BY_SHEET.A,
  ...EXERCISES_BY_SHEET.B,
  ...EXERCISES_BY_SHEET.C,
];

export const getExercisesBySheet = (sheet: SheetType): Exercise[] => {
  return EXERCISES_BY_SHEET[sheet];
};

export const getExerciseById = (id: string): Exercise | undefined => {
  return ALL_EXERCISES.find(ex => ex.id === id);
};

export const getExerciseByName = (name: string): Exercise | undefined => {
  return ALL_EXERCISES.find(ex => ex.name === name);
};
