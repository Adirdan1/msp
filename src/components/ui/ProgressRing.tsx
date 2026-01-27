'use client';

interface ProgressRingProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export function ProgressRing({
    percentage,
    size = 120,
    strokeWidth = 8,
    className = ''
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    const getColor = () => {
        if (percentage >= 100) return 'var(--color-success)';
        if (percentage >= 75) return '#34d399';
        if (percentage >= 50) return 'var(--color-accent)';
        if (percentage >= 25) return 'var(--color-warning)';
        return 'var(--color-danger)';
    };

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={getColor()}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                    style={{
                        filter: `drop-shadow(0 0 6px ${getColor()})`,
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{percentage}%</span>
                <span className="text-xs text-[var(--color-text-muted)]">Complete</span>
            </div>
        </div>
    );
}
