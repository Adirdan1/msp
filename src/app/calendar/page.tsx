'use client';

import { useState, useEffect } from 'react';
import { useHabits } from '@/lib/hooks/useHabits';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { LogEntryModal } from '@/components/calendar/LogEntryModal';
import { BottomNav } from '@/components/ui/BottomNav';
import { getToday, addDays } from '@/lib/utils/dates';
import { Habit, HabitLog } from '@/lib/types';

export default function CalendarPage() {
    const {
        habits,
        logs,
        isLoading,
        logProgress,
        deleteLogEntry,
        updateLogEntry
    } = useHabits();

    const [days, setDays] = useState(7);
    const [endDate, setEndDate] = useState(getToday());

    // Derived state
    const today = getToday();
    const activeHabits = habits.filter(h => h.isActive);
    const todayLogs = logs.filter(l => l.date === today);
    const sessionLogs = logs.filter(l => l.createdAt > new Date(Date.now() - 1000 * 60 * 60).toISOString()); // Rough "session" based on 1 hour? Or just stick to "Logged Today"?
    // Actually the previous "This Session" logic was based on local state accumulation. 
    // Since we removed local state, "This Session" is harder to track without a separate state.
    // I will replace "This Session" with "Total Logs" or similar, or just remove it if not critical.
    // Or I can keep a simple counter for "Logs Added" this layout mount.
    const [sessionLogCount, setSessionLogCount] = useState(0);

    // Modal state
    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [showModal, setShowModal] = useState(false);

    const handleLogProgress = (habitId: string, amount: number, date: string) => {
        logProgress(habitId, amount, date);
        setSessionLogCount(prev => prev + 1);
    };

    const handleDeleteLog = (logId: string) => {
        deleteLogEntry(logId);
    };

    const handleUpdateLog = (logId: string, newAmount: number) => {
        updateLogEntry(logId, { amount: newAmount });
    };

    const handleOpenModal = (habit: Habit, date: string) => {
        setSelectedHabit(habit);
        setSelectedDate(date);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedHabit(null);
        setSelectedDate('');
    };

    const handlePrev = () => {
        setEndDate(current => addDays(current, -days));
    };

    const handleNext = () => {
        setEndDate(current => addDays(current, days));
    };

    const handleToday = () => {
        setEndDate(getToday());
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-lg font-medium text-muted">Loading calendar...</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="container safe-top pb-24">
                <header className="page-header mb-4">
                    <h1 className="page-title">Habit Calendar</h1>
                    <div className="flex items-center gap-2">
                        <select
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value))}
                            className="input select text-sm py-1 px-2 h-9"
                            style={{ width: 'auto' }}
                        >
                            <option value={3}>3 Days</option>
                            <option value={7}>7 Days</option>
                            <option value={14}>14 Days</option>
                            <option value={30}>30 Days</option>
                        </select>
                    </div>
                </header>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between mb-4 glass-card p-2">
                    <button onClick={handlePrev} className="btn btn-ghost btn-sm">
                        ← Prev
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                            {endDate === today ? 'Current View' : endDate}
                        </span>
                        {endDate !== today && (
                            <button onClick={handleToday} className="btn btn-xs btn-secondary">
                                Jump to Today
                            </button>
                        )}
                    </div>
                    <button
                        onClick={handleNext}
                        className="btn btn-ghost btn-sm"
                        disabled={endDate >= today} // Optional: disable future navigation if desired, but user asked to "slide back and forth". I'll leave it enabled or maybe disable if strictly > today + days? 
                    // User said "slide back and forth". I'll allow future sliding.
                    >
                        Next →
                    </button>
                </div>

                {/* Calendar Grid - One Click to Log! */}
                <CalendarGrid
                    habits={habits}
                    logs={logs}
                    days={days}
                    endDate={endDate}
                    onLogProgress={handleLogProgress}
                    onOpenModal={handleOpenModal}
                />

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="stat-card">
                        <div className="stat-value success">
                            {activeHabits.length}
                        </div>
                        <div className="stat-label">Active Habits</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">
                            {todayLogs.length}
                        </div>
                        <div className="stat-label">Logged Today</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">
                            {sessionLogCount > 0 && <span className="text-success">+{sessionLogCount}</span>}
                            {sessionLogCount === 0 && days}
                        </div>
                        <div className="stat-label">{sessionLogCount > 0 ? 'Session Adds' : 'Days Shown'}</div>
                    </div>
                </div>
            </div>

            {/* Log Entry Modal */}
            <LogEntryModal
                isOpen={showModal}
                onClose={handleCloseModal}
                habit={selectedHabit}
                date={selectedDate}
                logs={logs}
                onLogProgress={handleLogProgress}
                onDeleteLog={handleDeleteLog}
                onUpdateLog={handleUpdateLog}
            />

            <BottomNav />
        </>
    );
}
