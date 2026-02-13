'use client';

import { useHabits } from '@/lib/hooks/useHabits';
import { useStats } from '@/lib/hooks/useStats';
import { BottomNav } from '@/components/ui/BottomNav';
import { PeriodSelector } from '@/components/ui/PeriodSelector';
import { HabitIconBadge } from '@/components/ui/HabitIcons';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

function getInsight(successRate: number, currentStreak: number): string {
    if (successRate >= 90 && currentStreak >= 7) return "Outstanding consistency! You're in the zone 🏆";
    if (successRate >= 80) return "Strong performance — keep building momentum! 💪";
    if (successRate >= 60) return "Solid progress. Stay focused on your goals 🎯";
    if (successRate >= 40) return "Room to grow — try tackling one habit at a time 🌱";
    if (successRate > 0) return "Every step forward counts. Start small, finish big 💫";
    return "Begin tracking to see your progress here 📊";
}

function StatsContent() {
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
                    <div className="w-16 h-16 mx-auto mb-4 skeleton" style={{ borderRadius: '50%' }} />
                    <div className="w-32 h-4 mx-auto skeleton" />
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

    const firstDayOfWeek = ((todayDayOfWeek - 27) % 7 + 7) % 7;

    const headers: string[] = [];
    for (let i = 0; i < 7; i++) {
        headers.push(dayNames[(firstDayOfWeek + i) % 7]);
    }

    // Mini bar chart — last 7 days completion
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];
        const dayLogs = logs.filter(l => l.date === dateStr);
        const activeCount = activeHabits.length || 1;
        const completedCount = activeHabits.filter(h => {
            const habitLogs = dayLogs.filter(l => l.habitId === h.id);
            const total = habitLogs.reduce((sum, l) => sum + l.amount, 0);
            return total >= h.goalAmount;
        }).length;
        return {
            label: d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
            percentage: Math.round((completedCount / activeCount) * 100),
            date: dateStr,
        };
    });

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
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22,4 12,14.01 9,11.01" />
                                    </svg>
                                    <span className="text-sm text-muted">Success Rate</span>
                                </div>
                                <div className="stat-value success">{overallStats.successRate}%</div>
                            </div>
                            {overallStats.comparison.vsLastWeek !== 0 && (
                                <div className={`stat-change ${getChangeColor(overallStats.comparison.vsLastWeek)}`}>
                                    {overallStats.comparison.vsLastWeek > 0 ? '↑' : '↓'} {Math.abs(overallStats.comparison.vsLastWeek)}% vs last week
                                </div>
                            )}
                        </div>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            {getInsight(overallStats.successRate, overallStats.currentStreak)}
                        </p>
                    </div>

                    <div className="stat-card">
                        <div className="flex items-center gap-2 mb-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2">
                                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                            </svg>
                            <span className="text-xs text-muted">Current Streak</span>
                        </div>
                        <div className="stat-value">{overallStats.currentStreak}</div>
                        <div className="stat-label">days</div>
                    </div>

                    <div className="stat-card">
                        <div className="flex items-center gap-2 mb-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                            </svg>
                            <span className="text-xs text-muted">Best Streak</span>
                        </div>
                        <div className="stat-value">{overallStats.longestStreak}</div>
                        <div className="stat-label">days</div>
                    </div>

                    <div className="stat-card">
                        <div className="flex items-center gap-2 mb-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
                                <polyline points="20,6 9,17 4,12" />
                            </svg>
                            <span className="text-xs text-muted">Completed</span>
                        </div>
                        <div className="stat-value success">{overallStats.totalHabitsCompleted}</div>
                    </div>

                    <div className="stat-card">
                        <div className="flex items-center gap-2 mb-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12,6 12,12 16,14" />
                            </svg>
                            <span className="text-xs text-muted">Active</span>
                        </div>
                        <div className="stat-value">{overallStats.activeHabits}</div>
                    </div>
                </div>

                {/* Weekly Bar Chart */}
                <div className="stat-card mb-6">
                    <div className="section-title" style={{ marginBottom: '16px' }}>Last 7 Days</div>
                    <div className="mini-bar-chart" style={{ paddingBottom: '20px' }}>
                        {last7Days.map((day) => {
                            const isToday = day.date === todayStr;
                            return (
                                <div
                                    key={day.date}
                                    className="mini-bar"
                                    data-label={day.label}
                                    style={{
                                        height: `${Math.max(day.percentage, 5)}%`,
                                        background: day.percentage >= 80
                                            ? 'linear-gradient(to top, var(--color-success), #6ee7b7)'
                                            : day.percentage >= 40
                                                ? 'linear-gradient(to top, var(--color-warning), #fde68a)'
                                                : day.percentage > 0
                                                    ? 'linear-gradient(to top, var(--color-danger), #fca5a5)'
                                                    : 'var(--color-neutral-bg)',
                                        border: isToday ? '2px solid var(--color-accent)' : 'none',
                                        boxShadow: day.percentage >= 80 ? '0 0 8px var(--color-success-glow)' : undefined,
                                    }}
                                    title={`${day.label}: ${day.percentage}%`}
                                />
                            );
                        })}
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
                                            cell.level === 1 ? 'rgba(52, 211, 153, 0.2)' :
                                                cell.level === 2 ? 'rgba(52, 211, 153, 0.4)' :
                                                    cell.level === 3 ? 'rgba(52, 211, 153, 0.6)' :
                                                        'var(--color-success)',
                                        border: isToday ? '2px solid var(--color-accent)' : 'none',
                                        borderRadius: 'var(--radius-xs)',
                                        boxShadow: cell.level >= 4 ? '0 0 6px var(--color-success-glow)' : undefined,
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
                                    className="w-3 h-3"
                                    style={{
                                        background: level === 0 ? 'var(--color-neutral-bg)' :
                                            level === 1 ? 'rgba(52, 211, 153, 0.2)' :
                                                level === 2 ? 'rgba(52, 211, 153, 0.4)' :
                                                    level === 3 ? 'rgba(52, 211, 153, 0.6)' :
                                                        'var(--color-success)',
                                        borderRadius: 'var(--radius-xs)',
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
                                                <HabitIconBadge name={habit.name} color={habit.color} size="sm" />
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
                                                    background: stats.successRate >= 75 ? 'linear-gradient(90deg, var(--color-success), #6ee7b7)' :
                                                        stats.successRate >= 50 ? 'linear-gradient(90deg, var(--color-warning), #fde68a)' :
                                                            'linear-gradient(90deg, var(--color-danger), #fca5a5)'
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

export default function StatsPage() {
    return (
        <ErrorBoundary>
            <StatsContent />
        </ErrorBoundary>
    );
}
