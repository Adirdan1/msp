'use client';

import { OverallStats } from '@/lib/types';

interface SuccessRateCardProps {
    stats: OverallStats;
}

export function SuccessRateCard({ stats }: SuccessRateCardProps) {
    const getTrendIcon = () => {
        if (stats.comparison.direction === 'up') return '▲';
        if (stats.comparison.direction === 'down') return '▼';
        return '–';
    };

    const getTrendClass = () => {
        if (stats.comparison.direction === 'up') return 'positive';
        if (stats.comparison.direction === 'down') return 'negative';
        return '';
    };

    return (
        <div className="glass-card-elevated p-6 text-center animate-scale-in">
            <div className="text-sm font-medium text-[var(--color-text-muted)] mb-2">
                🏆 SUCCESS RATE
            </div>

            <div className="text-5xl font-extrabold text-gradient mb-2">
                {stats.successRate}%
            </div>

            {stats.comparison.vsLastWeek !== 0 && (
                <div className={`stat-trend ${getTrendClass()}`}>
                    <span>{getTrendIcon()}</span>
                    <span>{Math.abs(stats.comparison.vsLastWeek)}% vs last week</span>
                </div>
            )}
        </div>
    );
}
