// Core Types for My Success Power

export type HabitCategory = 'health' | 'productivity' | 'hobby' | 'chore' | 'custom';
export type GoalPeriod = 'day' | 'week' | 'custom';
export type TimePeriod = 'day' | 'week' | 'month' | 'year';
export type HabitType = 'good' | 'bad'; // good = build, bad = break/avoid

export interface Habit {
    id: string;
    name: string;
    icon: string;
    category: HabitCategory;
    unit: string;
    habitType?: HabitType; // 'good' (default) or 'bad' (habits to break)

    // Goal configuration
    goalAmount: number;
    goalPeriod: GoalPeriod;
    goalPeriodDays: number; // For custom periods (e.g., 3 days)

    // Tracking
    isActive: boolean;
    createdAt: string;
    color?: string;
}

export interface HabitLog {
    id: string;
    habitId: string;
    amount: number;
    date: string; // ISO date string (YYYY-MM-DD)
    note?: string;
    createdAt: string;
}

export interface HabitWithProgress extends Habit {
    progress: number; // Current progress amount
    target: number; // Target for current period
    percentage: number; // 0-100
    isCompleted: boolean;
    todayLogs: HabitLog[];
}

export interface HabitStats {
    habitId: string;
    successRate: number;
    currentStreak: number;
    longestStreak: number;
    totalCompleted: number;
    totalAmount: number;
    averagePerDay: number;
    comparison: {
        vsLastPeriod: number; // Percentage change
        direction: 'up' | 'down' | 'same';
    };
}

export interface OverallStats {
    successRate: number;
    currentStreak: number;
    longestStreak: number;
    totalHabitsCompleted: number;
    activeHabits: number;
    comparison: {
        vsLastWeek: number;
        vsLastMonth: number;
        direction: 'up' | 'down' | 'same';
    };
}

export interface DailyProgress {
    date: string;
    totalHabits: number;
    completedHabits: number;
    percentage: number;
    habits: {
        habitId: string;
        name: string;
        icon: string;
        progress: number;
        target: number;
        isCompleted: boolean;
    }[];
}

// Preset habits for quick add
export interface PresetHabit {
    name: string;
    icon: string;
    category: HabitCategory;
    unit: string;
    defaultGoalAmount: number;
    defaultGoalPeriod: GoalPeriod;
    defaultGoalPeriodDays: number;
    color: string;
    habitType?: HabitType;
}

export const PRESET_HABITS: PresetHabit[] = [
    {
        name: 'Water',
        icon: 'W',
        category: 'health',
        unit: 'L',
        defaultGoalAmount: 2,
        defaultGoalPeriod: 'day',
        defaultGoalPeriodDays: 1,
        color: '#3b82f6',
    },
    {
        name: 'Reading',
        icon: 'R',
        category: 'productivity',
        unit: 'min',
        defaultGoalAmount: 30,
        defaultGoalPeriod: 'day',
        defaultGoalPeriodDays: 1,
        color: '#8b5cf6',
    },
    {
        name: 'Exercise',
        icon: 'E',
        category: 'health',
        unit: 'min',
        defaultGoalAmount: 30,
        defaultGoalPeriod: 'day',
        defaultGoalPeriodDays: 1,
        color: '#10b981',
    },
    {
        name: 'Meditation',
        icon: 'M',
        category: 'health',
        unit: 'min',
        defaultGoalAmount: 10,
        defaultGoalPeriod: 'day',
        defaultGoalPeriodDays: 1,
        color: '#f59e0b',
    },
    {
        name: 'Sleep',
        icon: 'S',
        category: 'health',
        unit: 'hours',
        defaultGoalAmount: 8,
        defaultGoalPeriod: 'day',
        defaultGoalPeriodDays: 1,
        color: '#6366f1',
    },
    {
        name: 'Fruits',
        icon: 'F',
        category: 'health',
        unit: 'servings',
        defaultGoalAmount: 3,
        defaultGoalPeriod: 'day',
        defaultGoalPeriodDays: 1,
        color: '#ef4444',
    },
    {
        name: 'Steps',
        icon: 'S',
        category: 'health',
        unit: 'steps',
        defaultGoalAmount: 10000,
        defaultGoalPeriod: 'day',
        defaultGoalPeriodDays: 1,
        color: '#14b8a6',
    },
    {
        name: 'Journal',
        icon: 'J',
        category: 'productivity',
        unit: 'entries',
        defaultGoalAmount: 1,
        defaultGoalPeriod: 'day',
        defaultGoalPeriodDays: 1,
        color: '#ec4899',
    },
    {
        name: 'Vitamins',
        icon: 'V',
        category: 'health',
        unit: 'pills',
        defaultGoalAmount: 1,
        defaultGoalPeriod: 'day',
        defaultGoalPeriodDays: 1,
        color: '#f97316',
    },
    {
        name: 'Study',
        icon: 'S',
        category: 'productivity',
        unit: 'hours',
        defaultGoalAmount: 2,
        defaultGoalPeriod: 'day',
        defaultGoalPeriodDays: 1,
        color: '#0ea5e9',
    },
    {
        name: 'Stretch',
        icon: 'S',
        category: 'health',
        unit: 'min',
        defaultGoalAmount: 10,
        defaultGoalPeriod: 'day',
        defaultGoalPeriodDays: 1,
        color: '#a855f7',
    },
    {
        name: 'No Sugar',
        icon: 'N',
        category: 'health',
        unit: 'days',
        defaultGoalAmount: 1,
        defaultGoalPeriod: 'day',
        defaultGoalPeriodDays: 1,
        color: '#f43f5e',
        habitType: 'bad',
    },
];

// Quick amount presets per unit
export const QUICK_AMOUNTS: Record<string, number[]> = {
    'L': [0.25, 0.5, 1, 1.5],
    'ml': [100, 250, 500, 1000],
    'min': [5, 10, 15, 30],
    'hours': [0.5, 1, 2, 4],
    'pages': [5, 10, 20, 50],
    'steps': [1000, 2500, 5000, 10000],
    'servings': [1, 2, 3, 4],
    'entries': [1, 2, 3, 5],
    'pills': [1, 2, 3, 4],
    'days': [1],
    'times': [1, 2, 5, 10],
    'default': [1, 2, 5, 10],
};

