'use client';

import { useState, useEffect } from 'react';
import { useHabits } from '@/lib/hooks/useHabits';
import { AddHabitModal } from '@/components/habits/AddHabitModal';
import { BottomNav } from '@/components/ui/BottomNav';
import { HabitIconBadge } from '@/components/ui/HabitIcons';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { StreakCelebration } from '@/components/ui/StreakCelebration';
import { getSettings, AppSettings } from '@/lib/storage';
import { formatDate, getToday } from '@/lib/utils/dates';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

function getMotivation(progress: number): string {
  if (progress >= 100) return "Perfect day! You've crushed every goal 💪";
  if (progress >= 80) return "Almost there — keep the momentum going! 🔥";
  if (progress >= 50) return "Great progress! You're on track today ✨";
  if (progress >= 25) return "Good start — every step counts 🌱";
  if (progress > 0) return "You've begun — that's what matters 💫";
  return "Ready to build your success today? 🚀";
}

export default function HomePage() {
  const {
    habits,
    habitsWithProgress,
    isLoading,
    addHabit,
    logProgress,
    deleteLogEntry,
    getTodayProgress,
  } = useHabits();

  const [showAddModal, setShowAddModal] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [showUndo, setShowUndo] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Celebration state
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const todayProgress = getTodayProgress();

  // Check for celebration
  useEffect(() => {
    if (!settings || isLoading) return;

    const threshold = settings.successThreshold || 80;
    if (todayProgress >= threshold && !hasCelebrated && habitsWithProgress.length > 0) {
      setCelebrationActive(true);
      setHasCelebrated(true);
    }
  }, [todayProgress, settings, hasCelebrated, habitsWithProgress.length, isLoading]);

  // Auto-hide undo after 8 seconds of no activity
  useEffect(() => {
    if (showUndo && undoStack.length > 0) {
      const timer = setTimeout(() => {
        setShowUndo(false);
        setUndoStack([]);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showUndo, undoStack.length]);

  const handleLogProgress = (habitId: string, amount: number) => {
    const log = logProgress(habitId, amount);
    if (log) {
      setUndoStack(prev => [...prev, log.id]);
      setShowUndo(true);
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastId = undoStack[undoStack.length - 1];
      deleteLogEntry(lastId);
      setUndoStack(prev => prev.slice(0, -1));
      if (undoStack.length <= 1) {
        setShowUndo(false);
      }
    }
  };


  const completedCount = habitsWithProgress.filter(h => h.isCompleted).length;
  const totalCount = habitsWithProgress.length;
  const today = getToday();

  // Separate good and bad habits (bad habits are habits to break/avoid)
  const goodHabits = habitsWithProgress.filter(h => h.habitType !== 'bad');
  const badHabits = habitsWithProgress.filter(h => h.habitType === 'bad');

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
          <div className="w-16 h-16 mx-auto mb-4 skeleton" style={{ borderRadius: '50%' }} />
          <div className="w-32 h-4 mx-auto skeleton" />
        </div>
      </div>
    );
  }

  return (
    <>
      <StreakCelebration
        isActive={celebrationActive}
        onComplete={() => setCelebrationActive(false)}
      />
      <div className="container safe-top">
        {/* Header */}
        <header className="page-header">
          <div>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)', marginBottom: '2px' }}>
              {getGreeting()} 👋
            </p>
            <h1 className="page-title">My Success Power</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Habit
          </button>
        </header>

        {/* Hero Progress Card */}
        <div
          className="stat-card mb-6"
          style={{ textAlign: 'center', paddingTop: '28px', paddingBottom: '24px' }}
        >
          <div className="flex items-center justify-center mb-4">
            <ProgressRing percentage={todayProgress} size={130} strokeWidth={10} />
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
            {completedCount}/{totalCount} habits completed
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {getMotivation(todayProgress)}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>
            {formatDate(today, 'long')}
          </p>
        </div>

        {/* Habits List */}
        <div className="flex items-center justify-between mb-3">
          <div className="section-title mb-0" style={{ marginBottom: 0 }}>Your Habits</div>
          {habitsWithProgress.length > 0 && (
            <button
              onClick={() => setEditMode(!editMode)}
              className={`btn btn-sm btn-ghost ${editMode ? 'text-accent' : 'text-muted'}`}
              title={editMode ? 'Done editing' : 'Edit habits'}
              style={{ padding: '6px 10px' }}
            >
              {editMode ? (
                <span className="text-sm font-medium gradient-text">Done</span>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              )}
            </button>
          )}
        </div>

        {habitsWithProgress.length === 0 ? (
          <div className="stat-card text-center py-8">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--color-accent-light)' }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold mb-1">Start building habits</p>
            <p className="text-muted text-sm mb-5" style={{ maxWidth: '260px', margin: '0 auto 20px' }}>
              Add your first habit and watch your success grow day by day
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              Add Your First Habit
            </button>
          </div>
        ) : (
          <>
            {/* Good Habits Section */}
            {goodHabits.length > 0 && (
              <div className="space-y-3 mb-6">
                {goodHabits.map((habit, index) => (
                  <div
                    key={habit.id}
                    className="habit-list-item animate-stagger-in"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <HabitIconBadge name={habit.name} color={habit.color} size="md" />

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
                      {/* Minus button in edit mode */}
                      {editMode && habit.progress > 0 && (
                        <button
                          onClick={() => {
                            const subtractAmount = habit.target / 4;
                            handleLogProgress(habit.id, -subtractAmount);
                          }}
                          className="btn btn-sm btn-icon"
                          style={{
                            background: 'var(--color-danger)',
                            color: 'white',
                            width: '32px',
                            height: '32px',
                            padding: 0,
                            borderRadius: '50%',
                          }}
                          title={`Subtract ${(habit.target / 4).toFixed(1)}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (!habit.isCompleted) {
                            handleLogProgress(habit.id, habit.target / 4);
                          }
                        }}
                        disabled={habit.isCompleted}
                        className={`btn btn-sm font-mono font-bold animate-pop`}
                        key={`${habit.id}-${Math.round(habit.percentage)}`}
                        style={{
                          background: habit.percentage >= 100
                            ? 'var(--color-success)'
                            : habit.percentage >= 50
                              ? 'var(--color-warning)'
                              : 'var(--color-bg-elevated)',
                          color: habit.percentage >= 50 ? 'white' : undefined,
                          border: habit.percentage < 50 ? '1px solid var(--glass-border)' : 'none',
                          minWidth: '60px',
                          cursor: habit.isCompleted ? 'default' : 'pointer',
                          opacity: habit.isCompleted ? 1 : undefined,
                          transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          boxShadow: habit.percentage >= 100 ? '0 0 12px var(--color-success-glow)' : undefined,
                        }}
                        title={habit.isCompleted ? 'Completed!' : `Click to add ${(habit.target / 4).toFixed(1)}`}
                      >
                        {habit.percentage >= 100 ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-pop">
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                        ) : (
                          `${Math.round(habit.percentage)}%`
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bad Habits Section */}
            {badHabits.length > 0 && (
              <>
                <div className="section-title" style={{ marginTop: goodHabits.length > 0 ? '1rem' : 0 }}>
                  🚫 Habits to Break
                </div>
                <div className="space-y-3">
                  {badHabits.map((habit, index) => (
                    <div
                      key={habit.id}
                      className="habit-list-item animate-stagger-in"
                      style={{
                        borderLeft: '3px solid var(--color-danger)',
                        animationDelay: `${(goodHabits.length + index) * 60}ms`
                      }}
                    >
                      <HabitIconBadge name={habit.name} color={habit.color} size="md" />

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
                        {editMode && habit.progress > 0 && (
                          <button
                            onClick={() => {
                              const subtractAmount = habit.target / 4;
                              handleLogProgress(habit.id, -subtractAmount);
                            }}
                            className="btn btn-sm btn-icon"
                            style={{
                              background: 'var(--color-danger)',
                              color: 'white',
                              width: '32px',
                              height: '32px',
                              padding: 0,
                              borderRadius: '50%',
                            }}
                            title={`Subtract ${(habit.target / 4).toFixed(1)}`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (!habit.isCompleted) {
                              handleLogProgress(habit.id, habit.target / 4);
                            }
                          }}
                          disabled={habit.isCompleted}
                          className={`btn btn-sm font-mono font-bold animate-pop`}
                          key={`${habit.id}-${Math.round(habit.percentage)}`}
                          style={{
                            background: habit.percentage >= 100
                              ? 'var(--color-success)'
                              : habit.percentage >= 50
                                ? 'var(--color-warning)'
                                : 'var(--color-bg-elevated)',
                            color: habit.percentage >= 50 ? 'white' : undefined,
                            border: habit.percentage < 50 ? '1px solid var(--glass-border)' : 'none',
                            minWidth: '60px',
                            cursor: habit.isCompleted ? 'default' : 'pointer',
                            opacity: habit.isCompleted ? 1 : undefined,
                            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            boxShadow: habit.percentage >= 100 ? '0 0 12px var(--color-success-glow)' : undefined,
                          }}
                          title={habit.isCompleted ? 'Completed!' : `Click to add ${(habit.target / 4).toFixed(1)}`}
                        >
                          {habit.percentage >= 100 ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-pop">
                              <polyline points="20,6 9,17 4,12" />
                            </svg>
                          ) : (
                            `${Math.round(habit.percentage)}%`
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div className="flex items-center justify-center mb-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
            </div>
            <div className="stat-value" style={{ fontSize: '22px' }}>{habits.filter(h => h.isActive).length}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div className="flex items-center justify-center mb-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
              </svg>
            </div>
            <div className="stat-value success" style={{ fontSize: '22px' }}>{completedCount}</div>
            <div className="stat-label">Complete</div>
          </div>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div className="flex items-center justify-center mb-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className="stat-value warning" style={{ fontSize: '22px' }}>{totalCount - completedCount}</div>
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

      {/* Undo Toast */}
      {showUndo && (
        <div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-full)',
            padding: '10px 20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <span className="text-sm">
            {undoStack.length} action{undoStack.length > 1 ? 's' : ''} logged
          </span>
          <button
            onClick={handleUndo}
            className="btn btn-sm"
            style={{
              background: 'var(--gradient-accent)',
              color: 'white',
              fontWeight: 600,
              borderRadius: 'var(--radius-full)',
            }}
          >
            Undo ({undoStack.length})
          </button>
        </div>
      )}

      <BottomNav />
    </>
  );
}
