'use client';

import { Habit, HabitStats } from '@/lib/types';

interface HabitStatsListProps {
    habits: Habit[];
    habitStats: Map<string, HabitStats>;
}

export function HabitStatsList({ habits, habitStats }: HabitStatsListProps) {
    const activeHabits = habits.filter(h => h.isActive);

    if (activeHabits.length === 0) {
        return (
            <div className="glass-card p-6 text-center">
                <p className="text-[var(--color-text-muted)]">
                    No habits to show stats for yet.
                </p>
            </div>
        );
    }

    return (
        <div className="glass-card p-4">
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-4">
                BY HABIT
            </h3>

            <div className="space-y-4">
                {activeHabits.map((habit, index) => {
                    const stats = habitStats.get(habit.id);
                    if (!stats) return null;

                    return (
                        <div
                            key={habit.id}
                            className="animate-slide-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span>{habit.icon}</span>
                                    <span className="font-medium">{habit.name}</span>
                                </div>
                                <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                                    {stats.successRate}%
                                </span>
                            </div>

                            <div className="progress-bar">
                                <div
                                    className={`progress-bar-fill ${stats.successRate >= 75 ? 'progress-success' :
                                            stats.successRate >= 50 ? 'progress-accent' :
                                                'progress-warning'
                                        }`}
                                    style={{ width: `${stats.successRate}%` }}
                                />
                            </div>

                            {/* Mini stats */}
                            <div className="flex items-center gap-4 mt-2 text-xs text-[var(--color-text-muted)]">
                                <span>🔥 {stats.currentStreak} day streak</span>
                                <span>📈 {stats.averagePerDay.toFixed(1)}/{habit.unit}/day</span>
                                {stats.comparison.vsLastPeriod !== 0 && (
                                    <span className={stats.comparison.direction === 'up' ? 'text-success' : 'text-[var(--color-danger)]'}>
                                        {stats.comparison.direction === 'up' ? '▲' : '▼'} {Math.abs(stats.comparison.vsLastPeriod)}%
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
