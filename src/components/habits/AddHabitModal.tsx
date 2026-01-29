'use client';

import { useState, useEffect } from 'react';
import { Habit, PRESET_HABITS, GoalPeriod, HabitCategory, PresetHabit } from '@/lib/types';

interface AddHabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (habit: Omit<Habit, 'id' | 'createdAt' | 'isActive'>) => void;
}

// Color options for custom habits
const HABIT_COLORS = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
    '#f97316', '#eab308', '#22c55e', '#14b8a6',
    '#0ea5e9', '#3b82f6', '#a855f7', '#f43f5e',
];

export function AddHabitModal({ isOpen, onClose, onAdd }: AddHabitModalProps) {
    const [mode, setMode] = useState<'preset' | 'custom'>('preset');
    const [selectedPreset, setSelectedPreset] = useState<PresetHabit | null>(null);

    // Custom habit form state
    const [name, setName] = useState('');
    const [color, setColor] = useState('#6366f1');
    const [unit, setUnit] = useState('times');
    const [goalAmount, setGoalAmount] = useState(1);
    const [goalPeriod, setGoalPeriod] = useState<GoalPeriod>('day');
    const [goalPeriodDays, setGoalPeriodDays] = useState(1);
    const [category, setCategory] = useState<HabitCategory>('custom');

    // Lock body scroll when modal is open (fixes iOS Safari background scroll issue)
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

    if (!isOpen) return null;

    const handlePresetSelect = (preset: PresetHabit) => {
        setSelectedPreset(preset);
        setName(preset.name);
        setColor(preset.color);
        setUnit(preset.unit);
        setGoalAmount(preset.defaultGoalAmount);
        setGoalPeriod(preset.defaultGoalPeriod);
        setGoalPeriodDays(preset.defaultGoalPeriodDays);
        setCategory(preset.category);
        setMode('custom');
    };

    const handleSubmit = () => {
        if (!name.trim()) return;

        onAdd({
            name: name.trim(),
            icon: name.charAt(0).toUpperCase(),
            category,
            unit,
            goalAmount,
            goalPeriod,
            goalPeriodDays: goalPeriod === 'custom' ? goalPeriodDays : goalPeriod === 'day' ? 1 : 7,
            color,
        });

        resetForm();
        onClose();
    };

    const resetForm = () => {
        setMode('preset');
        setSelectedPreset(null);
        setName('');
        setColor('#6366f1');
        setUnit('times');
        setGoalAmount(1);
        setGoalPeriod('day');
        setGoalPeriodDays(1);
        setCategory('custom');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <>
            <div className="modal-backdrop" onClick={handleClose} />
            <div className="modal">
                <div className="modal-header">
                    <h2 className="modal-title">Add New Habit</h2>
                    <button onClick={handleClose} className="btn btn-icon btn-ghost">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    {mode === 'preset' ? (
                        <>
                            <p className="text-sm text-muted mb-4">
                                Choose a preset or scroll down for more
                            </p>

                            {/* Preset grid - scrollable */}
                            <div className="grid grid-cols-3 gap-2">
                                {PRESET_HABITS.map((preset) => (
                                    <button
                                        key={preset.name}
                                        onClick={() => handlePresetSelect(preset)}
                                        className="flex flex-col items-center p-3 rounded-lg border border-[var(--color-grid-line)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] transition-all"
                                    >
                                        <span
                                            className="w-10 h-10 rounded-md flex items-center justify-center font-bold text-white mb-2"
                                            style={{ background: preset.color }}
                                        >
                                            {preset.name.charAt(0)}
                                        </span>
                                        <span className="text-xs font-medium truncate w-full text-center">
                                            {preset.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Back button */}
                            <button
                                onClick={() => setMode('preset')}
                                className="btn btn-ghost text-sm mb-2"
                                style={{ marginLeft: '-8px' }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>

                            {/* Name */}
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Morning Walk"
                                    className="input"
                                />
                            </div>

                            {/* Color - compact */}
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

                            {/* Goal + Period in one row */}
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
                        </>
                    )}
                </div>

                {/* Footer - always visible */}
                <div className="modal-footer">
                    {mode === 'preset' ? (
                        <button
                            onClick={() => setMode('custom')}
                            className="btn btn-primary w-full py-3"
                        >
                            ✨ Create Custom Habit
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={!name.trim()}
                            className="btn btn-primary w-full py-3"
                        >
                            Create Habit
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
