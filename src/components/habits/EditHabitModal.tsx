'use client';

import { useState, useEffect } from 'react';
import { Habit, GoalPeriod, HabitCategory } from '@/lib/types';

interface EditHabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    habit: Habit | null;
    onSave: (habitId: string, updates: Partial<Habit>) => void;
}

const HABIT_COLORS = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
    '#f97316', '#eab308', '#22c55e', '#14b8a6',
    '#0ea5e9', '#3b82f6', '#a855f7', '#f43f5e',
];

export function EditHabitModal({ isOpen, onClose, habit, onSave }: EditHabitModalProps) {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#6366f1');
    const [unit, setUnit] = useState('times');
    const [goalAmount, setGoalAmount] = useState(1);
    const [goalPeriod, setGoalPeriod] = useState<GoalPeriod>('day');
    const [goalPeriodDays, setGoalPeriodDays] = useState(1);
    const [category, setCategory] = useState<HabitCategory>('custom');

    // Populate form when habit changes
    useEffect(() => {
        if (habit) {
            setName(habit.name);
            setColor(habit.color || '#6366f1');
            setUnit(habit.unit);
            setGoalAmount(habit.goalAmount);
            setGoalPeriod(habit.goalPeriod);
            setGoalPeriodDays(habit.goalPeriodDays);
            setCategory(habit.category);
        }
    }, [habit]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
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
    }, [isOpen]);

    if (!isOpen || !habit) return null;

    const handleSubmit = () => {
        if (!name.trim()) return;

        onSave(habit.id, {
            name: name.trim(),
            icon: name.charAt(0).toUpperCase(),
            category,
            unit,
            goalAmount,
            goalPeriod,
            goalPeriodDays: goalPeriod === 'custom' ? goalPeriodDays : goalPeriod === 'day' ? 1 : 7,
            color,
        });

        onClose();
    };

    return (
        <>
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal animate-slide-up">
                <div className="modal-header">
                    <h2 className="modal-title">Edit Habit</h2>
                    <button onClick={onClose} className="btn btn-icon btn-ghost">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    {/* Name */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Morning Walk"
                            className="input"
                            autoFocus
                        />
                    </div>

                    {/* Color */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Color</label>
                        <div className="flex gap-1.5 flex-wrap">
                            {HABIT_COLORS.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className="w-7 h-7 rounded transition-transform"
                                    style={{
                                        background: c,
                                        transform: color === c ? 'scale(1.15)' : 'scale(1)',
                                        boxShadow: color === c ? `0 0 0 2px var(--color-bg-secondary), 0 0 0 3px ${c}` : 'none'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Goal + Period */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Goal</label>
                            <div className="flex gap-1">
                                <input
                                    type="number"
                                    value={goalAmount}
                                    onChange={(e) => setGoalAmount(Number(e.target.value))}
                                    min={1}
                                    className="input"
                                    style={{ width: '60px' }}
                                />
                                <select
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="input select flex-1"
                                >
                                    <option value="times">times</option>
                                    <option value="min">min</option>
                                    <option value="hours">hrs</option>
                                    <option value="L">L</option>
                                    <option value="ml">ml</option>
                                    <option value="pages">pg</option>
                                    <option value="steps">steps</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Period</label>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setGoalPeriod('day')}
                                    className={`btn btn-sm flex-1 ${goalPeriod === 'day' ? 'btn-primary' : 'btn-secondary'}`}
                                >
                                    Day
                                </button>
                                <button
                                    onClick={() => setGoalPeriod('week')}
                                    className={`btn btn-sm flex-1 ${goalPeriod === 'week' ? 'btn-primary' : 'btn-secondary'}`}
                                >
                                    Week
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as HabitCategory)}
                            className="input select"
                        >
                            <option value="health">Health</option>
                            <option value="productivity">Productivity</option>
                            <option value="hobby">Hobby</option>
                            <option value="chore">Chore</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        onClick={handleSubmit}
                        disabled={!name.trim()}
                        className="btn btn-primary w-full py-3"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </>
    );
}
