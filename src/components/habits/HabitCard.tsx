'use client';

import { HabitWithProgress } from '@/lib/types';
import { QUICK_AMOUNTS } from '@/lib/types';
import { useState } from 'react';

interface HabitCardProps {
    habit: HabitWithProgress;
    onLogProgress: (habitId: string, amount: number) => void;
    onQuickComplete: (habitId: string) => void;
    onEdit?: (habitId: string) => void;
}

export function HabitCard({ habit, onLogProgress, onQuickComplete, onEdit }: HabitCardProps) {
    const [showQuickAdd, setShowQuickAdd] = useState(false);

    const quickAmounts = QUICK_AMOUNTS[habit.unit] || QUICK_AMOUNTS['default'];

    const getProgressClass = () => {
        if (habit.percentage >= 100) return 'progress-success';
        if (habit.percentage >= 50) return 'progress-accent';
        return 'progress-warning';
    };

    const handleQuickAdd = (amount: number) => {
        onLogProgress(habit.id, amount);
        setShowQuickAdd(false);
    };

    return (
        <div
            className={`habit-card animate-slide-up ${habit.isCompleted ? 'completed' : ''}`}
            style={{ animationDelay: '50ms' }}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                    className="habit-icon shrink-0"
                    style={{
                        background: habit.color ? `${habit.color}20` : undefined,
                    }}
                >
                    <span>{habit.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-[var(--color-text-primary)] truncate">
                            {habit.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                                {formatProgress(habit.progress, habit.unit)} / {formatProgress(habit.target, habit.unit)}
                            </span>
                            {habit.isCompleted && (
                                <span className="text-lg">✅</span>
                            )}
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="progress-bar mb-2">
                        <div
                            className={`progress-bar-fill ${getProgressClass()}`}
                            style={{ width: `${Math.min(habit.percentage, 100)}%` }}
                        />
                    </div>

                    {/* Quick actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {!showQuickAdd ? (
                            <>
                                {!habit.isCompleted && (
                                    <button
                                        onClick={() => setShowQuickAdd(true)}
                                        className="btn btn-ghost text-xs py-1 px-2"
                                    >
                                        + Add
                                    </button>
                                )}
                                {!habit.isCompleted && (
                                    <button
                                        onClick={() => onQuickComplete(habit.id)}
                                        className="btn btn-primary text-xs py-1 px-2"
                                    >
                                        Complete
                                    </button>
                                )}
                                {habit.isCompleted && (
                                    <button
                                        onClick={() => setShowQuickAdd(true)}
                                        className="btn btn-ghost text-xs py-1 px-2"
                                    >
                                        + Add More
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center gap-1 animate-fade-in">
                                {quickAmounts.map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => handleQuickAdd(amount)}
                                        className="btn btn-ghost text-xs py-1 px-2"
                                    >
                                        +{formatProgress(amount, habit.unit)}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setShowQuickAdd(false)}
                                    className="btn btn-ghost text-xs py-1 px-2 text-[var(--color-text-muted)]"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatProgress(value: number, unit: string): string {
    // Format large numbers
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k ${unit}`;
    }

    // Format decimals nicely
    if (value % 1 !== 0) {
        return `${value.toFixed(1)} ${unit}`;
    }

    return `${value} ${unit}`;
}
