// Local Storage utilities for habit data persistence

import { Habit, HabitLog } from '../types';

const STORAGE_KEYS = {
    HABITS: 'msp_habits',
    LOGS: 'msp_logs',
    SETTINGS: 'msp_settings',
} as const;

// ============================================
// Habits CRUD
// ============================================

export function getHabits(): Habit[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export function saveHabits(habits: Habit[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
}

export function addHabit(habit: Habit): Habit[] {
    const habits = getHabits();
    habits.push(habit);
    saveHabits(habits);
    return habits;
}

export function updateHabit(habitId: string, updates: Partial<Habit>): Habit[] {
    const habits = getHabits();
    const index = habits.findIndex(h => h.id === habitId);
    if (index !== -1) {
        habits[index] = { ...habits[index], ...updates };
        saveHabits(habits);
    }
    return habits;
}

export function deleteHabit(habitId: string): Habit[] {
    const habits = getHabits().filter(h => h.id !== habitId);
    saveHabits(habits);
    // Also delete related logs
    const logs = getLogs().filter(l => l.habitId !== habitId);
    saveLogs(logs);
    return habits;
}

export function getHabitById(habitId: string): Habit | undefined {
    return getHabits().find(h => h.id === habitId);
}

// ============================================
// Logs CRUD
// ============================================

export function getLogs(): HabitLog[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export function saveLogs(logs: HabitLog[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
}

export function addLog(log: HabitLog): HabitLog[] {
    const logs = getLogs();
    logs.push(log);
    saveLogs(logs);
    return logs;
}

export function updateLog(logId: string, updates: Partial<HabitLog>): HabitLog[] {
    const logs = getLogs();
    const index = logs.findIndex(l => l.id === logId);
    if (index !== -1) {
        logs[index] = { ...logs[index], ...updates };
        saveLogs(logs);
    }
    return logs;
}

export function deleteLog(logId: string): HabitLog[] {
    const logs = getLogs().filter(l => l.id !== logId);
    saveLogs(logs);
    return logs;
}

export function getLogsByHabit(habitId: string): HabitLog[] {
    return getLogs().filter(l => l.habitId === habitId);
}

export function getLogsByDate(date: string): HabitLog[] {
    return getLogs().filter(l => l.date === date);
}

export function getLogsByHabitAndDateRange(habitId: string, startDate: string, endDate: string): HabitLog[] {
    return getLogs().filter(l =>
        l.habitId === habitId &&
        l.date >= startDate &&
        l.date <= endDate
    );
}

export function getLogsByDateRange(startDate: string, endDate: string): HabitLog[] {
    return getLogs().filter(l => l.date >= startDate && l.date <= endDate);
}

// ============================================
// Settings
// ============================================

export interface AppSettings {
    theme: 'dark' | 'light' | 'system';
    hapticFeedback: boolean;
    notifications: boolean;
    successThreshold: number; // Percentage (0-100) required to maintain streak
}

const DEFAULT_SETTINGS: AppSettings = {
    theme: 'dark',
    hapticFeedback: true,
    notifications: false,
    successThreshold: 80, // Default to 80% as a reasonable challenge
};

export function getSettings(): AppSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return DEFAULT_SETTINGS;
    try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

export function saveSettings(settings: Partial<AppSettings>): AppSettings {
    const current = getSettings();
    const updated = { ...current, ...settings };
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    }
    return updated;
}

// ============================================
// Demo data for first-time users
// ============================================

export function initializeDemoData(): void {
    const habits = getHabits();
    if (habits.length > 0) return; // Already has data

    const demoHabits: Habit[] = [
        {
            id: 'demo-water',
            name: 'Water',
            icon: 'W',
            category: 'health',
            unit: 'L',
            goalAmount: 2,
            goalPeriod: 'day',
            goalPeriodDays: 1,
            isActive: true,
            createdAt: new Date().toISOString(),
            color: '#3b82f6',
        },
        {
            id: 'demo-reading',
            name: 'Reading',
            icon: 'R',
            category: 'productivity',
            unit: 'min',
            goalAmount: 30,
            goalPeriod: 'day',
            goalPeriodDays: 1,
            isActive: true,
            createdAt: new Date().toISOString(),
            color: '#8b5cf6',
        },
        {
            id: 'demo-exercise',
            name: 'Exercise',
            icon: 'E',
            category: 'health',
            unit: 'min',
            goalAmount: 30,
            goalPeriod: 'day',
            goalPeriodDays: 1,
            isActive: true,
            createdAt: new Date().toISOString(),
            color: '#10b981',
        },
    ];

    saveHabits(demoHabits);
}
