'use client';

import { useState, useEffect } from 'react';
import { Habit, HabitLog, QUICK_AMOUNTS } from '@/lib/types';
import { getDatesBetween, getDaysAgo, getToday, formatDate } from '@/lib/utils/dates';
import { calculateHabitProgress } from '@/lib/stats';

interface CalendarGridProps {
    habits: Habit[];
    logs: HabitLog[];
    days?: number;
    onLogProgress: (habitId: string, amount: number, date: string) => void;
}

export function CalendarGrid({ habits, logs, days = 14, onLogProgress }: CalendarGridProps) {
    const today = getToday();
    const startDate = getDaysAgo(days - 1);
    const dates = getDatesBetween(startDate, today);
    const activeHabits = habits.filter(h => h.isActive);

    // Track recently clicked cells for animation
    const [clickedCells, setClickedCells] = useState<Set<string>>(new Set());

    const getCellData = (habit: Habit, date: string) => {
        if (date > today) return { status: 'future' as const, percentage: 0, progress: 0 };

        const dayLogs = logs.filter(l => l.habitId === habit.id && l.date === date);
        const { percentage, progress, target } = calculateHabitProgress(habit, dayLogs, date);

        let status: 'success' | 'partial' | 'missed' | 'future' | 'empty';
        if (percentage >= 100) status = 'success';
        else if (percentage >= 50) status = 'partial';
        else if (percentage > 0) status = 'partial';
        else if (date === today) status = 'empty';
        else status = 'missed';

        return { status, percentage, progress, target };
    };



    const formatDayHeader = (date: string) => {
        const d = new Date(date);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
        const dayNum = d.getDate();
        return { dayName, dayNum };
    };

    const handleCellClick = (habit: Habit, date: string) => {
        if (date > today) return;

        // Get the quick add amount for this habit's unit
        const quickAmounts = QUICK_AMOUNTS[habit.unit] || QUICK_AMOUNTS['default'];
        const quickAmount = quickAmounts[0]; // Use smallest quick amount

        // Log progress immediately
        onLogProgress(habit.id, quickAmount, date);

        // Add to clicked cells for animation
        const cellKey = `${habit.id}-${date}`;
        setClickedCells(prev => new Set(prev).add(cellKey));

        // Remove from clicked cells after animation
        setTimeout(() => {
            setClickedCells(prev => {
                const next = new Set(prev);
                next.delete(cellKey);
                return next;
            });
        }, 600);
    };

    if (activeHabits.length === 0) {
        return (
            <div className="stat-card text-center py-12">
                <p className="text-muted">No habits to track yet.</p>
                <p className="text-muted text-sm mt-2">Add your first habit to see the calendar.</p>
            </div>
        );
    }

    return (
        <div className="calendar-container">
            {/* Quick Add Hint */}
            <div className="text-xs text-muted mb-3 flex items-center gap-2">
                <span>👆 Click cell to quick-add</span>
                <span className="text-accent">•</span>
                <span>Green = Complete</span>
                <span>•</span>
                <span>Yellow = Partial</span>
                <span>•</span>
                <span>Red = Missed</span>
            </div>

            <div
                className="calendar-grid"
                style={{
                    gridTemplateColumns: `minmax(140px, 180px) repeat(${dates.length}, minmax(44px, 1fr))`
                }}
            >
                {/* Header Row */}
                <div className="calendar-header-row">
                    <div className="calendar-cell calendar-header-cell calendar-habit-cell">
                        Habit
                    </div>
                    {dates.map(date => {
                        const { dayName, dayNum } = formatDayHeader(date);
                        const isToday = date === today;
                        return (
                            <div
                                key={date}
                                className="calendar-cell calendar-header-cell"
                                style={isToday ? { background: 'var(--color-accent-light)', color: 'var(--color-accent)' } : {}}
                            >
                                <div>{dayName}</div>
                                <div style={{ fontWeight: 600, fontSize: '14px' }}>{dayNum}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Habit Rows */}
                {activeHabits.map(habit => {
                    const quickAmounts = QUICK_AMOUNTS[habit.unit] || QUICK_AMOUNTS['default'];
                    const quickAmount = quickAmounts[0];

                    return (
                        <div key={habit.id} className="calendar-row">
                            <div className="calendar-cell calendar-habit-cell">
                                <span
                                    className="habit-icon-badge"
                                    style={{
                                        background: habit.color ? `${habit.color}20` : 'var(--color-accent-light)',
                                        color: habit.color || 'var(--color-accent)'
                                    }}
                                >
                                    {habit.name.charAt(0).toUpperCase()}
                                </span>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {habit.name}
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                                        +{quickAmount} {habit.unit}/click
                                    </div>
                                </div>
                            </div>

                            {dates.map(date => {
                                const { status, percentage, progress } = getCellData(habit, date);
                                const cellKey = `${habit.id}-${date}`;
                                const isClicked = clickedCells.has(cellKey);
                                const isFuture = status === 'future';

                                return (
                                    <div
                                        key={date}
                                        className={`calendar-cell status-cell ${status} ${isClicked ? 'cell-clicked' : ''}`}
                                        onClick={() => !isFuture && handleCellClick(habit, date)}
                                        title={isFuture ? 'Future date' : `${habit.name} - ${formatDate(date, 'medium')}\n${progress}/${habit.goalAmount} ${habit.unit} (${percentage}%)\nClick to add +${quickAmount}`}
                                        style={{ cursor: isFuture ? 'default' : 'pointer' }}
                                    >
                                        {status !== 'future' && status !== 'empty' && (
                                            <div className={`status-indicator ${status}`} style={{ width: 'auto', minWidth: '28px', padding: '0 4px', fontSize: '10px' }}>
                                                {Math.round(percentage)}%
                                            </div>
                                        )}
                                        {status === 'empty' && (
                                            <div className="status-indicator empty">+</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
