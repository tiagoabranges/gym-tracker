/**
 * Página de Registro de Treino
 * Formulário para adicionar novos treinos
 */

import React, { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { getExercisesBySheet, getExerciseByName } from '@/lib/exercises';
import { formatDateForInput } from '@/lib/calculations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SheetType, LoadType, MuscleGroup } from '@/types';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
  const [, setLocation] = useLocation();
  const { addWorkout } = useWorkoutContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: formatDateForInput(new Date()),
    sheet: 'A' as SheetType,
    exercise: '',
    muscleGroup: 'Peito' as MuscleGroup,
    load: '',
    loadType: 'bilateral' as LoadType,
    reps: '',
    sets: '',
    notes: '',
  });

  // Obter exercícios disponíveis para a ficha selecionada
  const availableExercises = useMemo(
    () => getExercisesBySheet(formData.sheet),
    [formData.sheet]
  );

  const muscleGroups: MuscleGroup[] = [
    'Peito',
    'Costas',
    'Ombros',
    'Bíceps',
    'Tríceps',
    'Pernas',
    'Panturrilha',
  ];

  // Sugerir o primeiro exercício quando ficha muda
  React.useEffect(() => {
    const firstExercise = availableExercises[0];
    setFormData(prev => ({
      ...prev,
      exercise: firstExercise?.name || '',
      muscleGroup: firstExercise?.muscleGroup || prev.muscleGroup,
    }));
  }, [formData.sheet, availableExercises]);

  const selectedExercise = useMemo(
    () => getExerciseByName(formData.exercise),
    [formData.exercise]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const knownExercise = name === 'exercise' ? getExerciseByName(value) : undefined;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(knownExercise ? { muscleGroup: knownExercise.muscleGroup } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    if (!formData.exercise || !formData.load || !formData.reps || !formData.sets) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);

    try {
      await addWorkout({
        date: formData.date,
        sheet: formData.sheet,
        exercise: formData.exercise.trim(),
        muscleGroup: selectedExercise?.muscleGroup || formData.muscleGroup,
        load: parseFloat(formData.load),
        loadType: formData.loadType,
        reps: parseInt(formData.reps),
        sets: parseInt(formData.sets),
        notes: formData.notes || undefined,
      });

      toast.success('Treino registrado com sucesso!');

      // Resetar formulário
      setFormData({
        date: formatDateForInput(new Date()),
        sheet: 'A',
        exercise: getExercisesBySheet('A')[0]?.name || '',
        muscleGroup: getExercisesBySheet('A')[0]?.muscleGroup || 'Peito',
        load: '',
        loadType: 'bilateral',
        reps: '',
        sets: '',
        notes: '',
      });

      // Redirecionar após 1 segundo
      setTimeout(() => {
        setLocation('/history');
      }, 1000);
    } catch (error) {
      toast.error('Erro ao registrar treino');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Registrar Treino
          </h1>
          <p className="text-muted-foreground">
            Adicione um novo treino ao seu histórico
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Data */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Data do Treino *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Ficha */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Ficha *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['A', 'B', 'C'] as SheetType[]).map(sheet => (
                  <button
                    key={sheet}
                    type="button"
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        sheet,
                        exercise: getExercisesBySheet(sheet)[0]?.name || '',
                      }))
                    }
                    className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
                      formData.sheet === sheet
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    Ficha {sheet}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Ficha {formData.sheet}:{' '}
                {formData.sheet === 'A'
                  ? 'Peito, Ombros, Tríceps'
                  : formData.sheet === 'B'
                    ? 'Costas, Bíceps'
                    : 'Pernas, Panturrilha'}
              </p>
            </div>

            {/* Exercício */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Exercício *
              </label>
              <input
                list="exercise-options"
                name="exercise"
                value={formData.exercise}
                onChange={handleChange}
                placeholder="Ex: Supino reto com halteres"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <datalist id="exercise-options">
                {availableExercises.map(ex => (
                  <option key={ex.id} value={ex.name}>
                    {ex.name}
                  </option>
                ))}
              </datalist>
              <p className="text-xs text-muted-foreground mt-2">
                Digite um exercício novo ou escolha uma sugestão da ficha.
              </p>
            </div>

            {/* Grupo muscular */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Grupo muscular *
              </label>
              <select
                name="muscleGroup"
                value={selectedExercise?.muscleGroup || formData.muscleGroup}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {muscleGroups.map(group => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            {/* Carga */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Carga informada (kg) *
              </label>
              <input
                type="number"
                name="load"
                value={formData.load}
                onChange={handleChange}
                placeholder="Ex: 50"
                step="0.5"
                min="0"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Repetições e Séries */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Repetições *
                </label>
                <input
                  type="number"
                  name="reps"
                  value={formData.reps}
                  onChange={handleChange}
                  placeholder="Ex: 10"
                  min="1"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Séries *
                </label>
                <input
                  type="number"
                  name="sets"
                  value={formData.sets}
                  onChange={handleChange}
                  placeholder="Ex: 3"
                  min="1"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Tipo de Carga */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Tipo de Carga *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData(prev => ({
                      ...prev,
                      loadType: 'bilateral',
                    }))
                  }
                  className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
                    formData.loadType === 'bilateral'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  Por lado
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData(prev => ({
                      ...prev,
                      loadType: 'unilateral',
                    }))
                  }
                  className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
                    formData.loadType === 'unilateral'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  Total
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {formData.loadType === 'bilateral'
                  ? 'Ex: supino com halteres de 25 kg em cada mão. O app calcula 50 kg no volume.'
                  : 'Ex: puxada alta no pulley com 60 kg no equipamento.'}
              </p>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Observações
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Ex: Senti dor no ombro, ajustar amplitude"
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Volume Preview */}
            {formData.load && formData.reps && formData.sets && (
              <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-semibold text-foreground">
                    Volume Total: {(
                      parseFloat(formData.load) *
                      (formData.loadType === 'bilateral' ? 2 : 1) *
                      parseInt(formData.reps) *
                      parseInt(formData.sets)
                    ).toLocaleString('pt-BR')} kg
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formData.loadType === 'bilateral'
                    ? `${formData.load} kg × 2 lados × ${formData.reps} reps × ${formData.sets} séries`
                    : `${formData.load} kg × ${formData.reps} reps × ${formData.sets} séries`}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Salvando...' : 'Registrar Treino'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation('/history')}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Box */}
        <Card className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Dica
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Registre seus treinos assim que terminar a sessão para manter os dados precisos. Isso ajuda a gerar sugestões mais acuradas!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
