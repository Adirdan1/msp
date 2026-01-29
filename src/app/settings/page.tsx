'use client';

import { useState, useEffect } from 'react';
import { useHabits } from '@/lib/hooks/useHabits';
import { BottomNav } from '@/components/ui/BottomNav';
import { getSettings, saveSettings, AppSettings } from '@/lib/storage';

export default function SettingsPage() {
    const { habits, deleteHabit, toggleHabit } = useHabits();
    const [settings, setSettings] = useState<AppSettings>({
        theme: 'dark',
        hapticFeedback: true,
        notifications: false,
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
                    <div className="section-title">Appearance</div>

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
                    <div className="section-title">Preferences</div>

                    <div className="stat-card">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium">Haptic Feedback</p>
                                <p className="text-sm text-muted">Vibration on iOS devices</p>
                            </div>
                            <button
                                onClick={() => handleSettingChange('hapticFeedback', !settings.hapticFeedback)}
                                className="relative w-12 h-7 rounded-full transition-colors"
                                style={{
                                    background: settings.hapticFeedback ? 'var(--color-success)' : 'var(--color-neutral)'
                                }}
                            >
                                <span
                                    className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform"
                                    style={{
                                        transform: settings.hapticFeedback ? 'translateX(20px)' : 'translateX(2px)'
                                    }}
                                />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Manage Habits Section */}
                <section className="mb-6">
                    <div className="section-title">Manage Habits</div>

                    {habits.length === 0 ? (
                        <div className="stat-card text-center py-4">
                            <p className="text-muted">No habits to manage yet.</p>
                        </div>
                    ) : (
                        <div className="stat-card">
                            <div className="divide-y divide-[var(--color-grid-line)]">
                                {habits.map((habit) => (
                                    <div key={habit.id} className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold text-white"
                                                style={{
                                                    background: habit.color || 'var(--color-accent)',
                                                    opacity: habit.isActive ? 1 : 0.5
                                                }}
                                            >
                                                {habit.name.charAt(0)}
                                            </span>
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
                    <div className="section-title">About</div>

                    <div className="stat-card">
                        <div className="py-2">
                            <p className="font-medium">My Success Power</p>
                            <p className="text-sm text-muted">Version 1.5.2</p>
                        </div>
                        <div className="py-2 border-t border-[var(--color-grid-line)]">
                            <p className="text-sm text-muted">
                                Track your habits with flexible goals and see your success over time.
                                All data is stored locally on your device.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Delete Confirmation Modal */}
            {showConfirmDelete && (
                <>
                    <div className="modal-backdrop" onClick={() => setShowConfirmDelete(null)} />
                    <div className="modal" style={{ maxWidth: '360px' }}>
                        <div className="modal-body text-center py-6">
                            <div
                                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
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
