'use client';

import { useState, useEffect } from 'react';
import { useHabits } from '@/lib/hooks/useHabits';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { LogEntryModal } from '@/components/calendar/LogEntryModal';
import { BottomNav } from '@/components/ui/BottomNav';
import { getToday } from '@/lib/utils/dates';
import { addLog, deleteLog, updateLog } from '@/lib/storage';
import { generateId } from '@/lib/utils/dates';
import { Habit, HabitLog, QUICK_AMOUNTS } from '@/lib/types';

export default function CalendarPage() {
    const { habits, logs, isLoading } = useHabits();
    const [days, setDays] = useState(14);
    const [localLogs, setLocalLogs] = useState<HabitLog[]>([]);
    const [logCount, setLogCount] = useState(0);

    // Modal state
    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [showModal, setShowModal] = useState(false);

    // Sync localLogs with logs from hook when they change
    useEffect(() => {
        setLocalLogs(logs);
    }, [logs]);

    const handleLogProgress = (habitId: string, amount: number, date: string) => {
        const newLog: HabitLog = {
            id: generateId(),
            habitId,
            amount,
            date,
            createdAt: new Date().toISOString(),
        };
        addLog(newLog);
        // Update local state immediately for instant UI feedback
        setLocalLogs(prev => [...prev, newLog]);
        setLogCount(prev => prev + 1);
    };

    const handleDeleteLog = (logId: string) => {
        deleteLog(logId);
        setLocalLogs(prev => prev.filter(l => l.id !== logId));
    };

    const handleUpdateLog = (logId: string, newAmount: number) => {
        updateLog(logId, { amount: newAmount });
        setLocalLogs(prev => prev.map(l =>
            l.id === logId ? { ...l, amount: newAmount } : l
        ));
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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-lg font-medium text-muted">Loading calendar...</div>
                </div>
            </div>
        );
    }

    const activeHabits = habits.filter(h => h.isActive);
    const todayLogs = localLogs.filter(l => l.date === getToday());

    return (
        <>
            <div className="container safe-top">
                <header className="page-header">
                    <h1 className="page-title">Habit Calendar</h1>
                    <div className="flex items-center gap-2">
                        <select
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value))}
                            className="input select"
                            style={{ width: 'auto' }}
                        >
                            <option value={7}>7 days</option>
                            <option value={14}>14 days</option>
                            <option value={21}>21 days</option>
                            <option value={30}>30 days</option>
                        </select>
                    </div>
                </header>

                {/* Calendar Grid - One Click to Log! */}
                <CalendarGrid
                    habits={habits}
                    logs={localLogs}
                    days={days}
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
                            {logCount > 0 && <span className="text-success">+{logCount}</span>}
                            {logCount === 0 && days}
                        </div>
                        <div className="stat-label">{logCount > 0 ? 'This Session' : 'Days Shown'}</div>
                    </div>
                </div>
            </div>

            {/* Log Entry Modal */}
            <LogEntryModal
                isOpen={showModal}
                onClose={handleCloseModal}
                habit={selectedHabit}
                date={selectedDate}
                logs={localLogs}
                onLogProgress={handleLogProgress}
                onDeleteLog={handleDeleteLog}
                onUpdateLog={handleUpdateLog}
            />

            <BottomNav />
        </>
    );
}
