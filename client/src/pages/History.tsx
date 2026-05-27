/**
 * Página de Histórico de Treinos
 * Exibe tabela com todos os treinos registrados
 */

import React, { useState, useMemo } from 'react';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { formatDate, calculateVolume, formatLoad, getTotalLoad } from '@/lib/calculations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

export default function History() {
  const { workouts, deleteWorkout } = useWorkoutContext();
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [selectedSheet, setSelectedSheet] = useState<string>('');

  // Filtrar treinos
  const filteredWorkouts = useMemo(() => {
    let filtered = [...workouts];

    if (selectedExercise) {
      filtered = filtered.filter(w => w.exercise === selectedExercise);
    }

    if (selectedSheet) {
      filtered = filtered.filter(w => w.sheet === selectedSheet);
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [workouts, selectedExercise, selectedSheet]);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este treino?')) {
      await deleteWorkout(id);
      toast.success('Treino deletado');
    }
  };

  const exerciseNames = Array.from(new Set(workouts.map(w => w.exercise))).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Histórico de Treinos
          </h1>
          <p className="text-muted-foreground">
            Visualize todos os seus treinos registrados
          </p>
        </div>

        {/* Filtros */}
        <Card className="p-6 mb-6 bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ficha */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2">
                Ficha
              </label>
              <select
                value={selectedSheet}
                onChange={e => setSelectedSheet(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Todas</option>
                <option value="A">Ficha A</option>
                <option value="B">Ficha B</option>
                <option value="C">Ficha C</option>
              </select>
            </div>

            {/* Exercício */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2">
                Exercício
              </label>
              <select
                value={selectedExercise}
                onChange={e => setSelectedExercise(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Todos</option>
                {exerciseNames.map(name => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedExercise('');
                  setSelectedSheet('');
                }}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabela */}
        {filteredWorkouts.length > 0 ? (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Ficha
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Exercício
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Grupo Muscular
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                      Carga (kg)
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                      Reps
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                      Séries
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                      Volume
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkouts.map(workout => (
                    <tr
                      key={workout.id}
                      className="border-b border-border hover:bg-secondary/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-foreground">
                        {formatDate(workout.date)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-block px-2 py-1 bg-primary/20 text-primary rounded font-semibold text-xs">
                          {workout.sheet}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground font-medium">
                        {workout.exercise}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {workout.muscleGroup}
                      </td>
                      <td className="px-4 py-3 text-sm text-center font-semibold text-foreground">
                        {formatLoad(workout.load, workout.loadType)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-foreground">
                        {workout.reps}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-foreground">
                        {workout.sets}
                      </td>
                      <td className="px-4 py-3 text-sm text-center font-semibold text-foreground">
                        {calculateVolume(workout.load, workout.reps, workout.sets, workout.loadType).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => toast.info('Edição em breve')}
                            className="p-1 hover:bg-secondary rounded transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleDelete(workout.id)}
                            className="p-1 hover:bg-destructive/10 rounded transition-colors"
                            title="Deletar"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              {workouts.length === 0
                ? 'Nenhum treino registrado ainda'
                : 'Nenhum treino encontrado com os filtros selecionados'}
            </p>
            <Button onClick={() => setSelectedExercise('')}>
              Limpar Filtros
            </Button>
          </Card>
        )}

        {/* Resumo */}
        {filteredWorkouts.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Total de Treinos</p>
              <p className="text-2xl font-bold text-foreground">
                {filteredWorkouts.length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Volume Total</p>
              <p className="text-2xl font-bold text-foreground">
                {filteredWorkouts
                  .reduce((sum, w) => sum + calculateVolume(w.load, w.reps, w.sets, w.loadType), 0)
                  .toLocaleString('pt-BR')}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Carga Média</p>
              <p className="text-2xl font-bold text-foreground">
                {(
                  filteredWorkouts.reduce((sum, w) => sum + getTotalLoad(w.load, w.loadType), 0) /
                  filteredWorkouts.length
                ).toFixed(1)}
                kg
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
