/**
 * Página de Evolução
 * Visualização de gráficos de evolução de carga, volume e grupos musculares
 */

import React, { useState, useMemo } from 'react';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import {
  getExerciseEvolution,
  getVolumeEvolution,
  getVolumeByMuscleGroup,
} from '@/lib/calculations';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Evolution() {
  const { workouts } = useWorkoutContext();
  const [selectedExercise, setSelectedExercise] = useState<string>('');

  // Exercícios únicos
  const exerciseNames = useMemo(
    () => Array.from(new Set(workouts.map(w => w.exercise))).sort(),
    [workouts]
  );

  // Selecionar primeiro exercício por padrão
  React.useEffect(() => {
    if (exerciseNames.length > 0 && !selectedExercise) {
      setSelectedExercise(exerciseNames[0]);
    }
  }, [exerciseNames, selectedExercise]);

  // Dados para gráficos
  const exerciseEvolution = useMemo(
    () => (selectedExercise ? getExerciseEvolution(workouts, selectedExercise) : []),
    [workouts, selectedExercise]
  );

  const volumeEvolution = useMemo(() => getVolumeEvolution(workouts), [workouts]);

  const volumeByMuscle = useMemo(() => getVolumeByMuscleGroup(workouts), [workouts]);

  const muscleGroupData = useMemo(
    () =>
      Object.entries(volumeByMuscle).map(([name, volume]) => ({
        name,
        value: volume,
      })),
    [volumeByMuscle]
  );

  const COLORS = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Evolução
          </h1>
          <p className="text-muted-foreground">
            Visualize sua evolução de carga e volume ao longo do tempo
          </p>
        </div>

        {/* Gráfico 1: Evolução de Carga por Exercício */}
        {exerciseNames.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-foreground mb-3">
                📈 Evolução de Carga
              </h2>
              <select
                value={selectedExercise}
                onChange={e => setSelectedExercise(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {exerciseNames.map(name => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {exerciseEvolution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={exerciseEvolution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="date"
                    stroke="var(--color-muted-foreground)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'var(--color-foreground)' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="load"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-primary)', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Carga (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                Sem dados para este exercício
              </div>
            )}
          </Card>
        )}

        {/* Gráfico 2: Evolução de Volume por Treino */}
        {volumeEvolution.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-bold text-foreground mb-4">
              📊 Evolução de Volume por Treino
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={volumeEvolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="date"
                  stroke="var(--color-muted-foreground)"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                />
                <Bar
                  dataKey="volume"
                  fill="var(--color-chart-2)"
                  name="Volume (kg)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Gráfico 3: Volume por Grupo Muscular */}
        {muscleGroupData.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">
              💪 Volume por Grupo Muscular
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gráfico */}
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={muscleGroupData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {muscleGroupData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'var(--color-foreground)' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legenda com valores */}
              <div className="space-y-3">
                {muscleGroupData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.value.toLocaleString('pt-BR')} kg
                      </p>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {(
                        (item.value /
                          muscleGroupData.reduce((sum, m) => sum + m.value, 0)) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {workouts.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              Nenhum treino registrado ainda. Registre treinos para visualizar gráficos!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
