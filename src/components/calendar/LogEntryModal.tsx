'use client';

import { useState } from 'react';
import { Habit, HabitLog, QUICK_AMOUNTS } from '@/lib/types';
import { formatDate } from '@/lib/utils/dates';
import { calculateHabitProgress } from '@/lib/stats';

interface LogEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    habit: Habit | null;
    date: string;
    logs: HabitLog[];
    onLogProgress: (habitId: string, amount: number, date: string) => void;
}

export function LogEntryModal({ isOpen, onClose, habit, date, logs, onLogProgress }: LogEntryModalProps) {
    const [customAmount, setCustomAmount] = useState('');

    if (!isOpen || !habit) return null;

    const dayLogs = logs.filter(l => l.habitId === habit.id && l.date === date);
    const { progress, target, percentage } = calculateHabitProgress(habit, dayLogs, date);
    const quickAmounts = QUICK_AMOUNTS[habit.unit] || QUICK_AMOUNTS['default'];

    const handleQuickAdd = (amount: number) => {
        onLogProgress(habit.id, amount, date);
        // Brief delay to show the update before closing
        setTimeout(() => onClose(), 300);
    };

    const handleCustomAdd = () => {
        const amount = parseFloat(customAmount);
        if (!isNaN(amount) && amount > 0) {
            onLogProgress(habit.id, amount, date);
            setCustomAmount('');
            setTimeout(() => onClose(), 300);
        }
    };

    const getStatusColor = () => {
        if (percentage >= 100) return 'var(--color-success)';
        if (percentage >= 50) return 'var(--color-warning)';
        return 'var(--color-danger)';
    };

    return (
        <>
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal animate-slide-up">
                <div className="modal-header">
                    <div>
                        <div className="modal-title">{habit.name}</div>
                        <div className="text-sm text-muted">{formatDate(date, 'long')}</div>
                    </div>
                    <button onClick={onClose} className="btn btn-icon btn-ghost">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    {/* Current Progress */}
                    <div className="stat-card mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-muted text-sm">Progress</span>
                            <span className="font-mono font-semibold" style={{ color: getStatusColor() }}>
                                {percentage}%
                            </span>
                        </div>
                        <div className="habit-progress-bar" style={{ height: '8px' }}>
                            <div
                                className="habit-progress-fill"
                                style={{
                                    width: `${Math.min(percentage, 100)}%`,
                                    background: getStatusColor()
                                }}
                            />
                        </div>
                        <div className="flex items-center justify-between mt-2 text-sm">
                            <span className="text-muted">
                                {progress} / {target} {habit.unit}
                            </span>
                            <span className="text-muted">
                                {Math.max(0, target - progress)} {habit.unit} remaining
                            </span>
                        </div>
                    </div>

                    {/* Quick Add Buttons */}
                    <div className="section-title">Quick Add</div>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {quickAmounts.map((amount) => (
                            <button
                                key={amount}
                                onClick={() => handleQuickAdd(amount)}
                                className="btn btn-secondary"
                            >
                                +{amount} {habit.unit}
                            </button>
                        ))}
                    </div>

                    {/* Custom Amount */}
                    <div className="section-title">Custom Amount</div>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder={`Amount in ${habit.unit}`}
                            className="input flex-1"
                            step="0.1"
                            min="0"
                        />
                        <button
                            onClick={handleCustomAdd}
                            disabled={!customAmount || parseFloat(customAmount) <= 0}
                            className="btn btn-primary"
                        >
                            Add
                        </button>
                    </div>

                    {/* Today's Logs */}
                    {dayLogs.length > 0 && (
                        <div className="mt-6">
                            <div className="section-title">Logged Today</div>
                            <div className="space-y-2">
                                {dayLogs.map((log, i) => (
                                    <div key={log.id} className="flex items-center justify-between py-2 px-3 bg-[var(--color-bg-secondary)] rounded-md">
                                        <span className="font-mono">{log.amount} {habit.unit}</span>
                                        <span className="text-muted text-xs">
                                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
