'use client';

import { OverallStats } from '@/lib/types';

interface StatsOverviewProps {
    stats: OverallStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
    return (
        <div className="grid grid-cols-3 gap-3">
            {/* Current Streak */}
            <div className="stat-card animate-slide-up stagger-1">
                <div className="text-2xl mb-1">🔥</div>
                <div className="stat-value">{stats.currentStreak}</div>
                <div className="stat-label">Streak</div>
            </div>

            {/* Longest Streak */}
            <div className="stat-card animate-slide-up stagger-2">
                <div className="text-2xl mb-1">⭐</div>
                <div className="stat-value">{stats.longestStreak}</div>
                <div className="stat-label">Best</div>
            </div>

            {/* Total Completed */}
            <div className="stat-card animate-slide-up stagger-3">
                <div className="text-2xl mb-1">✅</div>
                <div className="stat-value">{stats.totalHabitsCompleted}</div>
                <div className="stat-label">Total</div>
            </div>
        </div>
    );
}
