'use client';

import { useHabits } from '@/lib/hooks/useHabits';
import { useStats } from '@/lib/hooks/useStats';
import { BottomNav } from '@/components/ui/BottomNav';
import { PeriodSelector } from '@/components/ui/PeriodSelector';

export default function StatsPage() {
    const { habits, logs, isLoading } = useHabits();
    const {
        period,
        setPeriod,
        overallStats,
        habitStats,
        heatmapData
    } = useStats(habits, logs);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-lg font-medium text-muted">Loading stats...</div>
                </div>
            </div>
        );
    }

    const getChangeColor = (value: number) => {
        if (value > 0) return 'positive';
        if (value < 0) return 'negative';
        return '';
    };

    const activeHabits = habits.filter(h => h.isActive);

    // Calculate proper day labels based on actual dates
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayDayOfWeek = today.getDay();

    // The heatmap shows 28 days ending today
    // We need to find what day of week the first cell is
    const firstDayOfWeek = ((todayDayOfWeek - 27) % 7 + 7) % 7;

    // Create headers starting from the correct day
    const headers: string[] = [];
    for (let i = 0; i < 7; i++) {
        headers.push(dayNames[(firstDayOfWeek + i) % 7]);
    }

    return (
        <>
            <div className="container safe-top">
                <header className="page-header">
                    <h1 className="page-title">Statistics</h1>
                </header>

                {/* Period Selector */}
                <div className="mb-6">
                    <PeriodSelector value={period} onChange={setPeriod} />
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="stat-card col-span-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-muted mb-1">Success Rate</div>
                                <div className="stat-value success">{overallStats.successRate}%</div>
                            </div>
                            {overallStats.comparison.vsLastWeek !== 0 && (
                                <div className={`stat-change ${getChangeColor(overallStats.comparison.vsLastWeek)}`}>
                                    {overallStats.comparison.vsLastWeek > 0 ? '↑' : '↓'} {Math.abs(overallStats.comparison.vsLastWeek)}% vs last week
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-value">{overallStats.currentStreak}</div>
                        <div className="stat-label">Current Streak</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-value">{overallStats.longestStreak}</div>
                        <div className="stat-label">Best Streak</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-value success">{overallStats.totalHabitsCompleted}</div>
                        <div className="stat-label">Completed</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-value">{overallStats.activeHabits}</div>
                        <div className="stat-label">Active Habits</div>
                    </div>
                </div>

                {/* Activity Heatmap */}
                <div className="stat-card mb-6">
                    <div className="section-title" style={{ marginBottom: '16px' }}>Activity</div>
                    <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                        {headers.map((day, i) => (
                            <div key={i} className="text-center text-xs text-muted py-1">{day}</div>
                        ))}
                        {heatmapData.map((cell) => {
                            const cellDate = new Date(cell.date);
                            const isToday = cell.date === todayStr;
                            return (
                                <div
                                    key={cell.date}
                                    className="aspect-square rounded-sm"
                                    style={{
                                        background: cell.level === 0 ? 'var(--color-neutral-bg)' :
                                            cell.level === 1 ? 'rgba(34, 197, 94, 0.2)' :
                                                cell.level === 2 ? 'rgba(34, 197, 94, 0.4)' :
                                                    cell.level === 3 ? 'rgba(34, 197, 94, 0.6)' :
                                                        'var(--color-success)',
                                        border: isToday ? '2px solid var(--color-accent)' : 'none'
                                    }}
                                    title={`${cellDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}: ${cell.level === 0 ? 'No activity' : `Level ${cell.level}`}`}
                                />
                            );
                        })}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted">
                            Today: {today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-muted mr-2">Less</span>
                            {[0, 1, 2, 3, 4].map((level) => (
                                <div
                                    key={level}
                                    className="w-3 h-3 rounded-sm"
                                    style={{
                                        background: level === 0 ? 'var(--color-neutral-bg)' :
                                            level === 1 ? 'rgba(34, 197, 94, 0.2)' :
                                                level === 2 ? 'rgba(34, 197, 94, 0.4)' :
                                                    level === 3 ? 'rgba(34, 197, 94, 0.6)' :
                                                        'var(--color-success)'
                                    }}
                                />
                            ))}
                            <span className="text-xs text-muted ml-2">More</span>
                        </div>
                    </div>
                </div>

                {/* Per-Habit Stats */}
                <div className="stat-card">
                    <div className="section-title" style={{ marginBottom: '16px' }}>By Habit</div>

                    {activeHabits.length === 0 ? (
                        <p className="text-muted text-center py-4">No habits to show stats for.</p>
                    ) : (
                        <div className="space-y-4">
                            {activeHabits.map((habit) => {
                                const stats = habitStats.get(habit.id);
                                if (!stats) return null;

                                return (
                                    <div key={habit.id}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white"
                                                    style={{ background: habit.color || 'var(--color-accent)' }}
                                                >
                                                    {habit.name.charAt(0)}
                                                </span>
                                                <span className="font-medium">{habit.name}</span>
                                            </div>
                                            <span className="text-sm font-mono" style={{
                                                color: stats.successRate >= 75 ? 'var(--color-success)' :
                                                    stats.successRate >= 50 ? 'var(--color-warning)' :
                                                        'var(--color-danger)'
                                            }}>
                                                {stats.successRate}%
                                            </span>
                                        </div>

                                        <div className="habit-progress-bar">
                                            <div
                                                className="habit-progress-fill"
                                                style={{
                                                    width: `${stats.successRate}%`,
                                                    background: stats.successRate >= 75 ? 'var(--color-success)' :
                                                        stats.successRate >= 50 ? 'var(--color-warning)' :
                                                            'var(--color-danger)'
                                                }}
                                            />
                                        </div>

                                        <div className="flex items-center gap-4 mt-2 text-xs text-muted">
                                            <span>{stats.currentStreak} day streak</span>
                                            <span>{stats.averagePerDay.toFixed(1)} {habit.unit}/day avg</span>
                                            {stats.comparison.vsLastPeriod !== 0 && (
                                                <span style={{
                                                    color: stats.comparison.direction === 'up' ? 'var(--color-success)' : 'var(--color-danger)'
                                                }}>
                                                    {stats.comparison.direction === 'up' ? '↑' : '↓'} {Math.abs(stats.comparison.vsLastPeriod)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <BottomNav />
        </>
    );
}
