// Statistics calculations for habits

import { Habit, HabitLog, HabitStats, OverallStats, HabitWithProgress, DailyProgress } from '../types';
import { getToday, getDaysAgo, getDatesBetween, getDaysBetween, getDateRange, getPreviousPeriodRange } from '../utils/dates';

/**
 * Calculate progress for a habit based on its goal period
 * This handles the flexible "rolling average" goal system
 */
export function calculateHabitProgress(
    habit: Habit,
    logs: HabitLog[],
    referenceDate: string = getToday()
): { progress: number; target: number; percentage: number; isCompleted: boolean } {
    const periodDays = habit.goalPeriod === 'day' ? 1 :
        habit.goalPeriod === 'week' ? 7 :
            habit.goalPeriodDays;

    // Get logs for the current period
    // Get logs for the current period relative to referenceDate
    const refDateObj = new Date(referenceDate);
    const startObj = new Date(refDateObj);
    startObj.setDate(refDateObj.getDate() - (periodDays - 1));
    const periodStart = startObj.toISOString().split('T')[0];

    const periodLogs = logs.filter(
        l => l.habitId === habit.id && l.date >= periodStart && l.date <= referenceDate
    );

    const progress = periodLogs.reduce((sum, log) => sum + log.amount, 0);
    const target = habit.goalAmount;
    const percentage = Math.min(Math.round((progress / target) * 100), 100);
    const isCompleted = progress >= target;

    return { progress, target, percentage, isCompleted };
}

/**
 * Get habit with its current progress
 */
export function getHabitWithProgress(habit: Habit, allLogs: HabitLog[]): HabitWithProgress {
    const today = getToday();
    const { progress, target, percentage, isCompleted } = calculateHabitProgress(habit, allLogs, today);
    const todayLogs = allLogs.filter(l => l.habitId === habit.id && l.date === today);

    return {
        ...habit,
        progress,
        target,
        percentage,
        isCompleted,
        todayLogs,
    };
}

/**
 * Calculate stats for a single habit
 */
export function calculateHabitStats(
    habit: Habit,
    allLogs: HabitLog[],
    period: 'day' | 'week' | 'month' | 'year' = 'week'
): HabitStats {
    const { start, end } = getDateRange(period);
    const prevRange = getPreviousPeriodRange(period);

    const habitLogs = allLogs.filter(l => l.habitId === habit.id);
    const periodLogs = habitLogs.filter(l => l.date >= start && l.date <= end);
    const prevPeriodLogs = habitLogs.filter(l => l.date >= prevRange.start && l.date <= prevRange.end);

    // Calculate totals
    const totalAmount = periodLogs.reduce((sum, l) => sum + l.amount, 0);
    const prevTotalAmount = prevPeriodLogs.reduce((sum, l) => sum + l.amount, 0);

    // Calculate days in period
    const daysInPeriod = getDaysBetween(start, end) + 1;
    const averagePerDay = totalAmount / daysInPeriod;

    // Calculate success rate (days where goal was met)
    const dates = getDatesBetween(start, end);
    let successfulDays = 0;

    for (const date of dates) {
        const dayLogs = habitLogs.filter(l => l.date === date);
        const { isCompleted } = calculateHabitProgress(habit, dayLogs, date);
        if (isCompleted) successfulDays++;
    }

    const successRate = Math.round((successfulDays / dates.length) * 100);

    // Calculate streaks
    const { currentStreak, longestStreak } = calculateStreaks(habit, habitLogs);

    // Calculate comparison
    const comparison = prevTotalAmount > 0
        ? Math.round(((totalAmount - prevTotalAmount) / prevTotalAmount) * 100)
        : totalAmount > 0 ? 100 : 0;

    return {
        habitId: habit.id,
        successRate,
        currentStreak,
        longestStreak,
        totalCompleted: successfulDays,
        totalAmount,
        averagePerDay,
        comparison: {
            vsLastPeriod: comparison,
            direction: comparison > 0 ? 'up' : comparison < 0 ? 'down' : 'same',
        },
    };
}

/**
 * Calculate current and longest streaks for a habit
 */
function calculateStreaks(habit: Habit, logs: HabitLog[]): { currentStreak: number; longestStreak: number } {
    const today = getToday();
    const sortedDates = [...new Set(logs.map(l => l.date))].sort().reverse();

    if (sortedDates.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let checkDate = today;

    // Calculate current streak (must be continuous from today or yesterday)
    const startCheckDate = sortedDates[0] === today ? today : getDaysAgo(1);

    for (let i = 0; i < 365; i++) {
        const date = getDaysAgo(i);
        const dayLogs = logs.filter(l => l.date === date);
        const { isCompleted } = calculateHabitProgress(habit, dayLogs, date);

        if (i === 0 && !isCompleted && date !== startCheckDate) {
            // Today not completed, but check if yesterday was
            continue;
        }

        if (isCompleted) {
            currentStreak++;
        } else if (i > 0) {
            break;
        }
    }

    // Calculate longest streak
    for (let i = 0; i < Math.min(sortedDates.length * 2, 365); i++) {
        const date = getDaysAgo(i);
        const dayLogs = logs.filter(l => l.date === date);
        const { isCompleted } = calculateHabitProgress(habit, dayLogs, date);

        if (isCompleted) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    }

    return { currentStreak, longestStreak };
}

/**
 * Calculate overall stats across all habits
 */
export function calculateOverallStats(
    habits: Habit[],
    logs: HabitLog[],
    period: 'day' | 'week' | 'month' | 'year' = 'week'
): OverallStats {
    const activeHabits = habits.filter(h => h.isActive);

    if (activeHabits.length === 0) {
        return {
            successRate: 0,
            currentStreak: 0,
            longestStreak: 0,
            totalHabitsCompleted: 0,
            activeHabits: 0,
            comparison: { vsLastWeek: 0, vsLastMonth: 0, direction: 'same' },
        };
    }

    const { start, end } = getDateRange(period);
    const dates = getDatesBetween(start, end);

    // Calculate success rate (average across all habits)
    let totalSuccessRate = 0;
    let totalCompleted = 0;
    let maxCurrentStreak = 0;
    let maxLongestStreak = 0;

    for (const habit of activeHabits) {
        const stats = calculateHabitStats(habit, logs, period);
        totalSuccessRate += stats.successRate;
        totalCompleted += stats.totalCompleted;
        maxCurrentStreak = Math.max(maxCurrentStreak, stats.currentStreak);
        maxLongestStreak = Math.max(maxLongestStreak, stats.longestStreak);
    }

    const avgSuccessRate = Math.round(totalSuccessRate / activeHabits.length);

    // Calculate weekly comparison
    const weekStats = calculatePeriodComparison(habits, logs, 'week');
    const monthStats = calculatePeriodComparison(habits, logs, 'month');

    return {
        successRate: avgSuccessRate,
        currentStreak: maxCurrentStreak,
        longestStreak: maxLongestStreak,
        totalHabitsCompleted: totalCompleted,
        activeHabits: activeHabits.length,
        comparison: {
            vsLastWeek: weekStats,
            vsLastMonth: monthStats,
            direction: weekStats > 0 ? 'up' : weekStats < 0 ? 'down' : 'same',
        },
    };
}

/**
 * Calculate comparison with previous period
 */
function calculatePeriodComparison(
    habits: Habit[],
    logs: HabitLog[],
    period: 'week' | 'month'
): number {
    const current = getDateRange(period);
    const previous = getPreviousPeriodRange(period);

    const currentDates = getDatesBetween(current.start, current.end);
    const previousDates = getDatesBetween(previous.start, previous.end);

    let currentSuccess = 0;
    let previousSuccess = 0;

    for (const habit of habits.filter(h => h.isActive)) {
        for (const date of currentDates) {
            const dayLogs = logs.filter(l => l.habitId === habit.id && l.date === date);
            if (calculateHabitProgress(habit, dayLogs, date).isCompleted) {
                currentSuccess++;
            }
        }

        for (const date of previousDates) {
            const dayLogs = logs.filter(l => l.habitId === habit.id && l.date === date);
            if (calculateHabitProgress(habit, dayLogs, date).isCompleted) {
                previousSuccess++;
            }
        }
    }

    if (previousSuccess === 0) {
        return currentSuccess > 0 ? 100 : 0;
    }

    return Math.round(((currentSuccess - previousSuccess) / previousSuccess) * 100);
}

/**
 * Get daily progress summary
 */
export function getDailyProgress(
    habits: Habit[],
    logs: HabitLog[],
    date: string = getToday()
): DailyProgress {
    const activeHabits = habits.filter(h => h.isActive);
    let completedCount = 0;

    const habitProgress = activeHabits.map(habit => {
        const { progress, target, isCompleted } = calculateHabitProgress(habit, logs, date);
        if (isCompleted) completedCount++;

        return {
            habitId: habit.id,
            name: habit.name,
            icon: habit.icon,
            progress,
            target,
            isCompleted,
        };
    });

    return {
        date,
        totalHabits: activeHabits.length,
        completedHabits: completedCount,
        percentage: activeHabits.length > 0
            ? Math.round((completedCount / activeHabits.length) * 100)
            : 0,
        habits: habitProgress,
    };
}

/**
 * Get heatmap data for visualization
 */
export function getHeatmapData(
    habits: Habit[],
    logs: HabitLog[],
    days: number = 28
): { date: string; level: 0 | 1 | 2 | 3 | 4 }[] {
    const data: { date: string; level: 0 | 1 | 2 | 3 | 4 }[] = [];
    const activeHabits = habits.filter(h => h.isActive);

    for (let i = days - 1; i >= 0; i--) {
        const date = getDaysAgo(i);
        const progress = getDailyProgress(activeHabits, logs, date);

        let level: 0 | 1 | 2 | 3 | 4;
        if (progress.percentage === 0) level = 0;
        else if (progress.percentage < 25) level = 1;
        else if (progress.percentage < 50) level = 2;
        else if (progress.percentage < 100) level = 3;
        else level = 4;

        data.push({ date, level });
    }

    return data;
}
