/**
 * Dashboard - Página inicial com métricas gerais
 */

import React, { useEffect, useState } from 'react';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { calculateStats, generateSuggestions, formatDate, formatLoad, getLoadEvolution, type LoadEvolution } from '@/lib/calculations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingUp, Zap, Target } from 'lucide-react';
import { Suggestion } from '@/types';

export default function Dashboard() {
  const { workouts, syncStatus } = useWorkoutContext();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadEvolutions, setLoadEvolutions] = useState<LoadEvolution[]>([]);

  // Gerar sugestões e evolução quando workouts mudam
  useEffect(() => {
    if (workouts.length > 0) {
      setSuggestions(generateSuggestions(workouts));
      setLoadEvolutions(getLoadEvolution(workouts));
    }
  }, [workouts]);

  const stats = calculateStats(workouts);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso e evolução de carga
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Dados salvos em: {syncStatus === 'supabase' ? 'Supabase' : 'este navegador'}
          </p>
        </div>

        {/* Evolução de Carga */}
        {loadEvolutions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Sua Evolução de Carga
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loadEvolutions.slice(0, 3).map(evolution => {
                const weeksElapsed = Math.ceil(evolution.daysElapsed / 7);
                const timeLabel = evolution.daysElapsed < 7 
                  ? `${evolution.daysElapsed} dias` 
                  : weeksElapsed === 1 
                  ? '1 semana' 
                  : `${weeksElapsed} semanas`;

                return (
                  <Card key={evolution.exerciseName} className="p-6 bg-card hover:shadow-lg transition-shadow">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-foreground mb-1">
                        {evolution.exerciseName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        em {timeLabel}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Inicial</p>
                          <p className="text-2xl font-bold text-foreground">
                            {evolution.initialLoad}
                            <span className="text-sm ml-1">kg</span>
                          </p>
                        </div>
                        <div className="text-2xl text-muted-foreground">→</div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Atual</p>
                          <p className="text-2xl font-bold text-green-600">
                            {evolution.finalLoad}
                            <span className="text-sm ml-1">kg</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">
                            {evolution.difference > 0 ? '+' : ''}{evolution.difference} kg
                          </span>
                          <span className={`text-sm font-semibold ${
                            evolution.difference > 0 
                              ? 'text-green-600' 
                              : evolution.difference < 0 
                              ? 'text-red-600' 
                              : 'text-muted-foreground'
                          }`}>
                            ({evolution.percentageChange > 0 ? '+' : ''}{evolution.percentageChange.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total de Treinos */}
          <Card className="p-6 bg-card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total de Treinos</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.totalWorkouts}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>



          {/* Maior Carga */}
          <Card className="p-6 bg-card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Maior Carga</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.maxLoad}
                </p>
                <p className="text-xs text-muted-foreground mt-1">kg</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </Card>

          {/* Exercício Mais Treinado */}
          <Card className="p-6 bg-card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mais Treinado</p>
                <p className="text-lg font-bold text-foreground truncate">
                  {stats.mostTrainedExercise || '—'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">exercício</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <AlertCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Sugestões */}
        {suggestions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">
              💡 Sugestões Inteligentes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((suggestion, idx) => (
                <Card key={idx} className="p-4 bg-card border-l-4 border-primary">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {suggestion.exerciseName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {suggestion.message}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Últimos Treinos */}
        {workouts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              📋 Últimos Treinos
            </h2>
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
                        Carga
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                        Reps
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                        Séries
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {workouts
                      .slice(-5)
                      .reverse()
                      .map(workout => (
                        <tr
                          key={workout.id}
                          className="border-b border-border hover:bg-secondary/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-foreground">
                            {formatDate(workout.date)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="inline-block px-2 py-1 bg-primary/20 text-primary rounded font-semibold">
                              {workout.sheet}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground">
                            {workout.exercise}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-foreground">
                            {formatLoad(workout.load, workout.loadType)}
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground">
                            {workout.reps}
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground">
                            {workout.sets}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {workouts.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              Nenhum treino registrado ainda
            </p>
            <Button>Registrar Primeiro Treino</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
