'use client';

import { useState, useEffect } from 'react';
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
    onDeleteLog?: (logId: string) => void;
    onUpdateLog?: (logId: string, newAmount: number) => void;
}

export function LogEntryModal({ isOpen, onClose, habit, date, logs, onLogProgress, onDeleteLog, onUpdateLog }: LogEntryModalProps) {
    const [customAmount, setCustomAmount] = useState('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [editingLogId, setEditingLogId] = useState<string | null>(null);
    const [editAmount, setEditAmount] = useState('');

    // Lock body scroll when modal is open (fixes iOS Safari background scroll issue)
    useEffect(() => {
        if (isOpen && habit) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen, habit]);

    if (!isOpen || !habit) return null;

    const dayLogs = logs.filter(l => l.habitId === habit.id && l.date === date);
    const { progress, target, percentage } = calculateHabitProgress(habit, dayLogs, date);
    const quickAmounts = QUICK_AMOUNTS[habit.unit] || QUICK_AMOUNTS['default'];

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 2000);
    };

    const handleQuickAdd = (amount: number) => {
        onLogProgress(habit.id, amount, date);
        showSuccess(`Added ${amount} ${habit.unit}!`);
    };

    const handleCustomAdd = () => {
        const amount = parseFloat(customAmount);
        if (!isNaN(amount) && amount > 0) {
            onLogProgress(habit.id, amount, date);
            setCustomAmount('');
            showSuccess(`Added ${amount} ${habit.unit}!`);
        }
    };

    const handleDeleteLog = (logId: string, amount: number) => {
        if (onDeleteLog) {
            onDeleteLog(logId);
            showSuccess(`Removed ${amount} ${habit.unit}`);
        }
    };

    const handleStartEdit = (log: HabitLog) => {
        setEditingLogId(log.id);
        setEditAmount(log.amount.toString());
    };

    const handleSaveEdit = (logId: string) => {
        const newAmount = parseFloat(editAmount);
        if (!isNaN(newAmount) && newAmount > 0 && onUpdateLog) {
            onUpdateLog(logId, newAmount);
            setEditingLogId(null);
            setEditAmount('');
            showSuccess(`Updated to ${newAmount} ${habit.unit}!`);
        }
    };

    const handleCancelEdit = () => {
        setEditingLogId(null);
        setEditAmount('');
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
                    {/* Success Message */}
                    {successMessage && (
                        <div
                            className="mb-4 py-2 px-4 rounded-lg text-center text-sm font-medium animate-slide-up"
                            style={{ background: 'var(--color-success)', color: 'white' }}
                        >
                            ✓ {successMessage}
                        </div>
                    )}

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
                                +{amount}
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

                    {/* Logged Entries with Edit/Delete */}
                    {dayLogs.length > 0 && (
                        <div className="mt-6">
                            <div className="section-title">Entries ({dayLogs.length})</div>
                            <div className="space-y-2">
                                {dayLogs.map((log) => (
                                    <div key={log.id} className="flex items-center justify-between py-2 px-3 bg-[var(--color-bg-secondary)] rounded-md">
                                        {editingLogId === log.id ? (
                                            <>
                                                <input
                                                    type="number"
                                                    value={editAmount}
                                                    onChange={(e) => setEditAmount(e.target.value)}
                                                    className="input"
                                                    style={{ width: '80px' }}
                                                    step="0.1"
                                                    min="0"
                                                    autoFocus
                                                />
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleSaveEdit(log.id)}
                                                        className="btn btn-sm btn-success"
                                                        title="Save"
                                                    >
                                                        ✓
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="btn btn-sm btn-ghost"
                                                        title="Cancel"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <span className="font-mono font-medium">{log.amount} {habit.unit}</span>
                                                    <span className="text-muted text-xs ml-2">
                                                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="flex gap-1">
                                                    {onUpdateLog && (
                                                        <button
                                                            onClick={() => handleStartEdit(log)}
                                                            className="btn btn-sm btn-ghost"
                                                            title="Edit"
                                                            style={{ color: 'var(--color-warning)' }}
                                                        >
                                                            ✎
                                                        </button>
                                                    )}
                                                    {onDeleteLog && (
                                                        <button
                                                            onClick={() => handleDeleteLog(log.id, log.amount)}
                                                            className="btn btn-sm btn-ghost"
                                                            title="Delete"
                                                            style={{ color: 'var(--color-danger)' }}
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            </>
                                        )}
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
