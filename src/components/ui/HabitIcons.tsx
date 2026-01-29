'use client';

// Monochromatic SVG icons for preset habits
// All icons are 24x24, stroke-based for consistent look

interface IconProps {
    className?: string;
}

export const HabitIcons: Record<string, React.FC<IconProps>> = {
    Water: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
    ),

    Reading: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    ),

    Exercise: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 6.5L17.5 17.5" />
            <path d="M7 12L12 7" />
            <path d="M12 17l5-5" />
            <circle cx="6" cy="6" r="2" />
            <circle cx="18" cy="18" r="2" />
        </svg>
    ),

    Meditation: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="6" r="2" />
            <path d="M12 8v2" />
            <path d="M8 14c0-2 2-4 4-4s4 2 4 4" />
            <path d="M6 18c0-2 2-4 6-4s6 2 6 4" />
            <path d="M4 22c0-2 4-4 8-4s8 2 8 4" />
        </svg>
    ),

    Sleep: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    ),

    Fruits: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="14" r="7" />
            <path d="M12 7V3" />
            <path d="M15 4c-1.5 0-3 1-3 3" />
        </svg>
    ),

    Steps: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 16v-4c0-1 1-2 2-2s2 1 2 2v2c0 1 1 2 2 2h2" />
            <path d="M20 8v4c0 1-1 2-2 2s-2-1-2-2v-2c0-1-1-2-2-2h-2" />
        </svg>
    ),

    Journal: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <line x1="8" y1="7" x2="16" y2="7" />
            <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
    ),

    Vitamins: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 8.5l7 7" />
            <path d="M16.5 7.5a3 3 0 0 1 0 4.24l-5.66 5.66a3 3 0 0 1-4.24-4.24l5.66-5.66a3 3 0 0 1 4.24 0z" />
        </svg>
    ),

    Study: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
    ),

    Stretch: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="4" r="2" />
            <path d="M12 6v6" />
            <path d="M8 10l-4 6" />
            <path d="M16 10l4 6" />
            <path d="M10 22l2-10 2 10" />
        </svg>
    ),

    'No Sugar': ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            <path d="M9 9c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3" />
            <path d="M12 12v4" />
        </svg>
    ),
};

// Get icon for a habit name, with fallback
export function getHabitIcon(name: string): React.FC<IconProps> | null {
    return HabitIcons[name] || null;
}

// Reusable badge component that shows icon or letter
interface HabitIconBadgeProps {
    name: string;
    color?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function HabitIconBadge({ name, color, size = 'md', className = '' }: HabitIconBadgeProps) {
    const IconComponent = getHabitIcon(name);

    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    return (
        <span
            className={`${sizeClasses[size]} rounded-md flex items-center justify-center flex-shrink-0 ${className}`}
            style={{
                background: color ? `${color}20` : 'var(--color-accent-light)',
                color: color || 'var(--color-accent)'
            }}
        >
            {IconComponent ? (
                <IconComponent className={iconSizes[size]} />
            ) : (
                <span className="font-bold text-xs">{name.charAt(0).toUpperCase()}</span>
            )}
        </span>
    );
}
