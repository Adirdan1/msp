'use client';

import { useState } from 'react';
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
                                Choose a preset or create your own habit
                            </p>

                            {/* Preset grid */}
                            <div className="grid grid-cols-3 gap-2 mb-6">
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

                            <div className="relative flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-[var(--color-grid-line)]" />
                                <span className="text-xs text-muted">OR CREATE CUSTOM</span>
                                <div className="flex-1 h-px bg-[var(--color-grid-line)]" />
                            </div>

                            <button
                                onClick={() => setMode('custom')}
                                className="btn btn-secondary w-full py-3"
                            >
                                Create Custom Habit
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Back button */}
                            <button
                                onClick={() => setMode('preset')}
                                className="btn btn-ghost text-sm mb-4"
                                style={{ marginLeft: '-8px' }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                Back to presets
                            </button>

                            {/* Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Morning Walk"
                                    className="input"
                                />
                            </div>

                            {/* Color */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {HABIT_COLORS.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className="w-8 h-8 rounded-md transition-transform"
                                            style={{
                                                background: c,
                                                transform: color === c ? 'scale(1.1)' : 'scale(1)',
                                                boxShadow: color === c ? `0 0 0 2px var(--color-bg-secondary), 0 0 0 4px ${c}` : 'none'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Goal */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Goal</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={goalAmount}
                                        onChange={(e) => setGoalAmount(Number(e.target.value))}
                                        min={1}
                                        className="input flex-1"
                                    />
                                    <select
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                        className="input select flex-1"
                                    >
                                        <option value="times">times</option>
                                        <option value="min">minutes</option>
                                        <option value="hours">hours</option>
                                        <option value="L">liters</option>
                                        <option value="ml">ml</option>
                                        <option value="pages">pages</option>
                                        <option value="steps">steps</option>
                                        <option value="servings">servings</option>
                                        <option value="days">days</option>
                                    </select>
                                </div>
                            </div>

                            {/* Period */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Period</label>
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => setGoalPeriod('day')}
                                        className={`btn ${goalPeriod === 'day' ? 'btn-primary' : 'btn-secondary'}`}
                                    >
                                        Daily
                                    </button>
                                    <button
                                        onClick={() => setGoalPeriod('week')}
                                        className={`btn ${goalPeriod === 'week' ? 'btn-primary' : 'btn-secondary'}`}
                                    >
                                        Weekly
                                    </button>
                                    <button
                                        onClick={() => setGoalPeriod('custom')}
                                        className={`btn ${goalPeriod === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
                                    >
                                        Custom
                                    </button>
                                </div>

                                {goalPeriod === 'custom' && (
                                    <div className="flex items-center gap-2 mt-3 animate-fade-in">
                                        <span className="text-sm text-muted">Every</span>
                                        <input
                                            type="number"
                                            value={goalPeriodDays}
                                            onChange={(e) => setGoalPeriodDays(Number(e.target.value))}
                                            min={1}
                                            max={30}
                                            className="input text-center"
                                            style={{ width: '80px' }}
                                        />
                                        <span className="text-sm text-muted">days</span>
                                    </div>
                                )}
                            </div>

                            {/* Category */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Category</label>
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

                {/* Footer */}
                {mode === 'custom' && (
                    <div className="modal-footer">
                        <button
                            onClick={handleSubmit}
                            disabled={!name.trim()}
                            className="btn btn-primary w-full py-3"
                        >
                            Create Habit
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
