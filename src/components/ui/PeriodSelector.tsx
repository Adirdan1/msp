'use client';

import { TimePeriod } from '@/lib/types';

interface PeriodSelectorProps {
    value: TimePeriod;
    onChange: (period: TimePeriod) => void;
}

const periods: { value: TimePeriod; label: string }[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
];

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
    return (
        <div className="tab-nav">
            {periods.map((period) => (
                <button
                    key={period.value}
                    onClick={() => onChange(period.value)}
                    className={`tab-nav-item no-select ${value === period.value ? 'active' : ''}`}
                >
                    {period.label}
                </button>
            ))}
        </div>
    );
}
