'use client';

import { useState, useEffect } from 'react';
import { useHabits } from '@/lib/hooks/useHabits';
import { BottomNav } from '@/components/ui/BottomNav';
import { HabitIconBadge } from '@/components/ui/HabitIcons';
import { getSettings, saveSettings, AppSettings } from '@/lib/storage';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { EditHabitModal } from '@/components/habits/EditHabitModal';
import { Habit } from '@/lib/types';

function SettingsContent() {
    const { habits, deleteHabit, toggleHabit, updateHabit } = useHabits();
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [settings, setSettings] = useState<AppSettings>({
        theme: 'dark',
        hapticFeedback: true,
        notifications: false,
        successThreshold: 80,
    });
    const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

    useEffect(() => {
        setSettings(getSettings());
    }, []);

    const handleSettingChange = (key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => {
        const updated = saveSettings({ [key]: value });
        setSettings(updated);

        if (key === 'theme') {
            document.documentElement.className = value as string;
        }
    };

    const handleDeleteHabit = (habitId: string) => {
        deleteHabit(habitId);
        setShowConfirmDelete(null);
    };

    return (
        <>
            <div className="container safe-top">
                <header className="page-header">
                    <h1 className="page-title">Settings</h1>
                </header>

                {/* Appearance Section */}
                <section className="mb-6">
                    <div className="section-title flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                        Appearance
                    </div>

                    <div className="stat-card">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium">Theme</p>
                                <p className="text-sm text-muted">Choose your color scheme</p>
                            </div>
                            <select
                                value={settings.theme}
                                onChange={(e) => handleSettingChange('theme', e.target.value as AppSettings['theme'])}
                                className="input select"
                                style={{ width: 'auto' }}
                            >
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                                <option value="system">System</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Preferences Section */}
                <section className="mb-6">
                    <div className="section-title flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="4" y1="21" x2="4" y2="14" />
                            <line x1="4" y1="10" x2="4" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12" y2="3" />
                            <line x1="20" y1="21" x2="20" y2="16" />
                            <line x1="20" y1="12" x2="20" y2="3" />
                            <line x1="1" y1="14" x2="7" y2="14" />
                            <line x1="9" y1="8" x2="15" y2="8" />
                            <line x1="17" y1="16" x2="23" y2="16" />
                        </svg>
                        Preferences
                    </div>

                    <div className="stat-card">
                        <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--glass-border)', marginBottom: '16px', paddingBottom: '16px' }}>
                            <div>
                                <p className="font-medium">Haptic Feedback</p>
                                <p className="text-sm text-muted">Vibration on iOS devices</p>
                            </div>
                            <button
                                onClick={() => handleSettingChange('hapticFeedback', !settings.hapticFeedback)}
                                className="toggle-switch"
                                data-on={String(settings.hapticFeedback)}
                            >
                                <span className="toggle-knob" />
                            </button>
                        </div>

                        <div className="py-2">
                            <div className="mb-3">
                                <p className="font-medium">Daily Success Goal</p>
                                <p className="text-sm text-muted">How much do you want to be successful?</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={settings.successThreshold || 80}
                                    onChange={(e) => handleSettingChange('successThreshold', parseInt(e.target.value))}
                                    className="flex-1 h-2 rounded-lg cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent-end) ${settings.successThreshold || 80}%, var(--color-neutral-bg) ${settings.successThreshold || 80}%, var(--color-neutral-bg) 100%)`
                                    }}
                                />
                                <span className="font-mono font-bold w-12 text-right gradient-text">
                                    {settings.successThreshold || 80}%
                                </span>
                            </div>
                            <p className="text-xs text-muted mt-2">
                                Achieve this daily progress to maintain your streak.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Manage Habits Section */}
                <section className="mb-6">
                    <div className="section-title flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Manage Habits
                    </div>

                    {habits.length === 0 ? (
                        <div className="stat-card text-center py-4">
                            <p className="text-muted">No habits to manage yet.</p>
                        </div>
                    ) : (
                        <div className="stat-card">
                            <div className="divide-y divide-[var(--glass-border)]">
                                {habits.map((habit) => (
                                    <div key={habit.id} className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            <HabitIconBadge
                                                name={habit.name}
                                                color={habit.color}
                                                size="md"
                                                className={habit.isActive ? '' : 'opacity-50'}
                                            />
                                            <div>
                                                <p className={`font-medium ${!habit.isActive ? 'text-muted' : ''}`}>
                                                    {habit.name}
                                                </p>
                                                <p className="text-xs text-muted">
                                                    {habit.goalAmount} {habit.unit} / {habit.goalPeriod === 'custom' ? `${habit.goalPeriodDays} days` : habit.goalPeriod}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setEditingHabit(habit)}
                                                className="btn btn-icon btn-sm btn-ghost"
                                                style={{ color: 'var(--color-warning)' }}
                                                title="Edit habit"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => toggleHabit(habit.id)}
                                                className={`btn btn-icon btn-sm ${habit.isActive ? 'btn-success' : 'btn-secondary'}`}
                                                title={habit.isActive ? 'Pause habit' : 'Resume habit'}
                                            >
                                                {habit.isActive ? (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="20,6 9,17 4,12" />
                                                    </svg>
                                                ) : (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="6" y="4" width="4" height="16" />
                                                        <rect x="14" y="4" width="4" height="16" />
                                                    </svg>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => setShowConfirmDelete(habit.id)}
                                                className="btn btn-icon btn-sm btn-ghost"
                                                style={{ color: 'var(--color-danger)' }}
                                                title="Delete habit"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3,6 5,6 21,6" />
                                                    <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* About Section */}
                <section className="mb-6">
                    <div className="section-title flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        About
                    </div>

                    <div className="stat-card">
                        <div className="py-2">
                            <p className="font-semibold gradient-text" style={{ fontSize: '16px' }}>My Success Power</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span
                                    className="text-xs font-mono px-2 py-0.5"
                                    style={{
                                        background: 'var(--color-accent-light)',
                                        color: 'var(--color-accent)',
                                        borderRadius: 'var(--radius-full)',
                                    }}
                                >
                                    v2.0.1
                                </span>
                            </div>
                        </div>
                        <div className="py-2" style={{ borderTop: '1px solid var(--glass-border)', marginTop: '8px', paddingTop: '12px' }}>
                            <p className="text-sm text-muted">
                                Track your habits with flexible goals and see your success over time.
                                All data is stored locally on your device.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Edit Habit Modal */}
            <EditHabitModal
                isOpen={!!editingHabit}
                onClose={() => setEditingHabit(null)}
                habit={editingHabit}
                onSave={(habitId, updates) => {
                    updateHabit(habitId, updates);
                    setEditingHabit(null);
                }}
            />

            {/* Delete Confirmation Modal */}
            {showConfirmDelete && (
                <>
                    <div className="modal-backdrop" onClick={() => setShowConfirmDelete(null)} />
                    <div className="modal" style={{ maxWidth: '360px' }}>
                        <div className="modal-body text-center py-6">
                            <div
                                className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                                style={{ background: 'var(--color-danger-bg)' }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2">
                                    <polyline points="3,6 5,6 21,6" />
                                    <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Delete Habit?</h3>
                            <p className="text-sm text-muted mb-6">
                                This will permanently delete this habit and all its tracking history.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmDelete(null)}
                                    className="btn btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteHabit(showConfirmDelete)}
                                    className="btn flex-1"
                                    style={{ background: 'var(--color-danger)', color: 'white' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <BottomNav />
        </>
    );
}

export default function SettingsPage() {
    return (
        <ErrorBoundary>
            <SettingsContent />
        </ErrorBoundary>
    );
}
