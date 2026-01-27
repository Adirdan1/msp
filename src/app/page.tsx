'use client';

import { useState } from 'react';
import { useHabits } from '@/lib/hooks/useHabits';
import { AddHabitModal } from '@/components/habits/AddHabitModal';
import { BottomNav } from '@/components/ui/BottomNav';
import { formatDate, getToday } from '@/lib/utils/dates';

export default function HomePage() {
  const {
    habits,
    habitsWithProgress,
    isLoading,
    addHabit,
    logProgress,
    quickComplete,
    getTodayProgress,
  } = useHabits();

  const [showAddModal, setShowAddModal] = useState(false);

  const todayProgress = getTodayProgress();
  const completedCount = habitsWithProgress.filter(h => h.isCompleted).length;
  const totalCount = habitsWithProgress.length;
  const today = getToday();

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'var(--color-success)';
    if (percentage >= 50) return 'var(--color-warning)';
    if (percentage > 0) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-muted">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container safe-top">
        {/* Header */}
        <header className="page-header">
          <div>
            <h1 className="page-title">My Success Power</h1>
            <p className="text-sm text-muted">{formatDate(today, 'long')}</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Habit
          </button>
        </header>

        {/* Today's Summary Card */}
        <div className="stat-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-muted mb-1">Today&apos;s Progress</div>
              <div className="text-3xl font-bold font-mono" style={{ color: getProgressColor(todayProgress) }}>
                {todayProgress}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{completedCount}/{totalCount}</div>
              <div className="text-sm text-muted">completed</div>
            </div>
          </div>

          <div className="habit-progress-bar" style={{ height: '10px' }}>
            <div
              className="habit-progress-fill"
              style={{
                width: `${todayProgress}%`,
                background: getProgressColor(todayProgress)
              }}
            />
          </div>
        </div>

        {/* Habits List */}
        <div className="section-title">Your Habits</div>

        {habitsWithProgress.length === 0 ? (
          <div className="stat-card text-center py-8">
            <p className="text-lg font-medium mb-2">No habits yet</p>
            <p className="text-muted text-sm mb-4">
              Add your first habit to start tracking your success
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              Add Your First Habit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {habitsWithProgress.map((habit) => (
              <div key={habit.id} className="habit-list-item">
                <span
                  className="habit-icon-badge"
                  style={{
                    background: habit.color ? `${habit.color}20` : 'var(--color-accent-light)',
                    color: habit.color || 'var(--color-accent)'
                  }}
                >
                  {habit.name.charAt(0).toUpperCase()}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium truncate">{habit.name}</span>
                    <span className="text-sm font-mono text-muted ml-2">
                      {habit.progress}/{habit.target} {habit.unit}
                    </span>
                  </div>
                  <div className="habit-progress-bar">
                    <div
                      className={`habit-progress-fill ${habit.percentage >= 100 ? 'success' :
                          habit.percentage >= 50 ? 'partial' :
                            'danger'
                        }`}
                      style={{ width: `${Math.min(habit.percentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!habit.isCompleted ? (
                    <>
                      <button
                        onClick={() => logProgress(habit.id, habit.target / 4)}
                        className="btn btn-sm btn-secondary"
                      >
                        +{(habit.target / 4).toFixed(1)}
                      </button>
                      <button
                        onClick={() => quickComplete(habit.id)}
                        className="btn btn-sm btn-success"
                      >
                        Done
                      </button>
                    </>
                  ) : (
                    <span className="btn btn-sm bg-success text-white" style={{ pointerEvents: 'none' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="stat-card">
            <div className="stat-value" style={{ fontSize: '24px' }}>{habits.filter(h => h.isActive).length}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value success" style={{ fontSize: '24px' }}>{completedCount}</div>
            <div className="stat-label">Complete</div>
          </div>
          <div className="stat-card">
            <div className="stat-value warning" style={{ fontSize: '24px' }}>{totalCount - completedCount}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
      </div>

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addHabit}
      />

      <BottomNav />
    </>
  );
}
