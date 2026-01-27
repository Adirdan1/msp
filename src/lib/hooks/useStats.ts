'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Habit, HabitLog, OverallStats, HabitStats, TimePeriod } from '../types';
import { calculateOverallStats, calculateHabitStats, getHeatmapData, getDailyProgress } from '../stats';
import { getDateRange, getDaysAgo, getDatesBetween } from '../utils/dates';

export function useStats(habits: Habit[], logs: HabitLog[]) {
    const [period, setPeriod] = useState<TimePeriod>('week');

    // Calculate overall stats for current period
    const overallStats = useMemo<OverallStats>(() => {
        return calculateOverallStats(habits, logs, period);
    }, [habits, logs, period]);

    // Calculate individual habit stats
    const habitStats = useMemo<Map<string, HabitStats>>(() => {
        const statsMap = new Map<string, HabitStats>();
        habits.filter(h => h.isActive).forEach(habit => {
            statsMap.set(habit.id, calculateHabitStats(habit, logs, period));
        });
        return statsMap;
    }, [habits, logs, period]);

    // Get heatmap data (last 28 days for week/month view, more for year)
    const heatmapData = useMemo(() => {
        const days = period === 'year' ? 365 : period === 'month' ? 30 : 7;
        return getHeatmapData(habits, logs, days);
    }, [habits, logs, period]);

    // Get daily progress for the period
    const dailyProgressData = useMemo(() => {
        const { start, end } = getDateRange(period);
        const dates = getDatesBetween(start, end);
        return dates.map(date => getDailyProgress(habits, logs, date));
    }, [habits, logs, period]);

    // Chart data for trend visualization
    const trendData = useMemo(() => {
        return dailyProgressData.map(d => ({
            date: d.date,
            percentage: d.percentage,
            completed: d.completedHabits,
            total: d.totalHabits,
        }));
    }, [dailyProgressData]);

    return {
        period,
        setPeriod,
        overallStats,
        habitStats,
        heatmapData,
        dailyProgressData,
        trendData,
    };
}
