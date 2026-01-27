'use client';

interface HeatmapProps {
    data: { date: string; level: 0 | 1 | 2 | 3 | 4 }[];
    className?: string;
}

export function Heatmap({ data, className = '' }: HeatmapProps) {
    const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
        <div className={`glass-card p-4 ${className}`}>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">
                ACTIVITY
            </h3>

            {/* Day labels */}
            <div className="flex gap-1 mb-2">
                {dayLabels.map((day, i) => (
                    <div
                        key={i}
                        className="flex-1 text-center text-xs text-[var(--color-text-muted)]"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Heatmap grid */}
            <div className="heatmap">
                {data.map((cell, index) => (
                    <div
                        key={cell.date}
                        className={`heatmap-cell level-${cell.level}`}
                        title={`${cell.date}: Level ${cell.level}`}
                        style={{ animationDelay: `${index * 20}ms` }}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1 mt-3">
                <span className="text-xs text-[var(--color-text-muted)] mr-2">Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className={`w-3 h-3 rounded-sm heatmap-cell level-${level}`}
                    />
                ))}
                <span className="text-xs text-[var(--color-text-muted)] ml-2">More</span>
            </div>
        </div>
    );
}
