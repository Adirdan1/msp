'use client';

import { useState, useEffect, useCallback } from 'react';
import { Habit, HabitLog, HabitWithProgress } from '../types';
import {
    getHabits,
    saveHabits,
    addHabit as storageAddHabit,
    updateHabit as storageUpdateHabit,
    deleteHabit as storageDeleteHabit,
    getLogs,
    addLog as storageAddLog,
    deleteLog as storageDeleteLog,
    initializeDemoData,
} from '../storage';
import { getHabitWithProgress } from '../stats';
import { generateId, getToday } from '../utils/dates';

export function useHabits() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [logs, setLogs] = useState<HabitLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [habitsWithProgress, setHabitsWithProgress] = useState<HabitWithProgress[]>([]);

    // Load data on mount
    useEffect(() => {
        initializeDemoData();
        const loadedHabits = getHabits();
        const loadedLogs = getLogs();
        setHabits(loadedHabits);
        setLogs(loadedLogs);
        setIsLoading(false);
    }, []);

    // Update habitsWithProgress whenever habits or logs change
    useEffect(() => {
        const activeHabits = habits.filter(h => h.isActive);
        const withProgress = activeHabits.map(h => getHabitWithProgress(h, logs));
        setHabitsWithProgress(withProgress);
    }, [habits, logs]);

    // Add a new habit
    const addHabit = useCallback((habitData: Omit<Habit, 'id' | 'createdAt' | 'isActive'>) => {
        const newHabit: Habit = {
            ...habitData,
            id: generateId(),
            createdAt: new Date().toISOString(),
            isActive: true,
        };
        const updated = storageAddHabit(newHabit);
        setHabits(updated);
        return newHabit;
    }, []);

    // Update a habit
    const updateHabit = useCallback((habitId: string, updates: Partial<Habit>) => {
        const updated = storageUpdateHabit(habitId, updates);
        setHabits(updated);
    }, []);

    // Delete a habit
    const deleteHabit = useCallback((habitId: string) => {
        const updated = storageDeleteHabit(habitId);
        setHabits(updated);
        // Logs are deleted in storage function
        setLogs(getLogs());
    }, []);

    // Toggle habit active state
    const toggleHabit = useCallback((habitId: string) => {
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
            updateHabit(habitId, { isActive: !habit.isActive });
        }
    }, [habits, updateHabit]);

    // Log progress for a habit
    const logProgress = useCallback((habitId: string, amount: number, note?: string) => {
        const newLog: HabitLog = {
            id: generateId(),
            habitId,
            amount,
            date: getToday(),
            note,
            createdAt: new Date().toISOString(),
        };
        const updated = storageAddLog(newLog);
        setLogs(updated);

        // Trigger haptic feedback on iOS
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(10);
        }

        return newLog;
    }, []);

    // Quick complete - log the full goal amount
    const quickComplete = useCallback((habitId: string) => {
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;

        const habitProgress = habitsWithProgress.find(h => h.id === habitId);
        if (!habitProgress) return;

        // Log the remaining amount to complete the goal
        const remaining = Math.max(0, habit.goalAmount - habitProgress.progress);
        if (remaining > 0) {
            logProgress(habitId, remaining);
        }
    }, [habits, habitsWithProgress, logProgress]);

    // Delete a log entry
    const deleteLogEntry = useCallback((logId: string) => {
        const updated = storageDeleteLog(logId);
        setLogs(updated);
    }, []);

    // Get today's completion percentage
    const getTodayProgress = useCallback(() => {
        if (habitsWithProgress.length === 0) return 0;
        const completed = habitsWithProgress.filter(h => h.isCompleted).length;
        return Math.round((completed / habitsWithProgress.length) * 100);
    }, [habitsWithProgress]);

    return {
        habits,
        logs,
        habitsWithProgress,
        isLoading,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabit,
        logProgress,
        quickComplete,
        deleteLogEntry,
        getTodayProgress,
    };
}
