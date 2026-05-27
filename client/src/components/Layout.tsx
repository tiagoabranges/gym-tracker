/**
 * Layout principal com navegação lateral
 */

import React, { useState } from 'react';
import { Link as WouterLink, useLocation } from 'wouter';


import { Menu, X, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import clsx from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { syncStatus } = useWorkoutContext();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/register', label: 'Registrar Treino', icon: '➕' },
    { href: '/history', label: 'Histórico', icon: '📋' },
    { href: '/evolution', label: 'Evolução', icon: '📈' },
  ];

  const isActive = (href: string) => location === href;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-border">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Dumbbell className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Gym Tracker</h1>
              <p className="text-xs text-muted-foreground">Evolução de Carga</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map(item => (
              <WouterLink
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors block',
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-foreground hover:bg-secondary'
                )}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </WouterLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border text-xs text-muted-foreground text-center">
            <p>Gym Tracker v1.0</p>
            <p className="mt-1">
              {syncStatus === 'supabase' ? 'Sincronizado com Supabase' : 'Dados locais'}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border">
          <h1 className="text-lg font-bold text-foreground">Gym Tracker</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
