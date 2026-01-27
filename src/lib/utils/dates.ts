// Date utility functions

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 */
export function getToday(): string {
    return new Date().toISOString().split('T')[0];
}

/**
 * Get a date N days ago as ISO string
 */
export function getDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
}

/**
 * Get start of current week (Monday)
 */
export function getStartOfWeek(): string {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    return date.toISOString().split('T')[0];
}

/**
 * Get start of current month
 */
export function getStartOfMonth(): string {
    const date = new Date();
    date.setDate(1);
    return date.toISOString().split('T')[0];
}

/**
 * Get start of current year
 */
export function getStartOfYear(): string {
    const date = new Date();
    date.setMonth(0, 1);
    return date.toISOString().split('T')[0];
}

/**
 * Get date range for a time period
 */
export function getDateRange(period: 'day' | 'week' | 'month' | 'year'): { start: string; end: string } {
    const end = getToday();
    let start: string;

    switch (period) {
        case 'day':
            start = end;
            break;
        case 'week':
            start = getStartOfWeek();
            break;
        case 'month':
            start = getStartOfMonth();
            break;
        case 'year':
            start = getStartOfYear();
            break;
    }

    return { start, end };
}

/**
 * Get previous period date range
 */
export function getPreviousPeriodRange(period: 'day' | 'week' | 'month' | 'year'): { start: string; end: string } {
    const current = getDateRange(period);
    const startDate = new Date(current.start);
    const endDate = new Date(current.end);

    switch (period) {
        case 'day':
            startDate.setDate(startDate.getDate() - 1);
            endDate.setDate(endDate.getDate() - 1);
            break;
        case 'week':
            startDate.setDate(startDate.getDate() - 7);
            endDate.setDate(endDate.getDate() - 7);
            break;
        case 'month':
            startDate.setMonth(startDate.getMonth() - 1);
            endDate.setMonth(endDate.getMonth() - 1);
            break;
        case 'year':
            startDate.setFullYear(startDate.getFullYear() - 1);
            endDate.setFullYear(endDate.getFullYear() - 1);
            break;
    }

    return {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
    };
}

/**
 * Get all dates between start and end (inclusive)
 */
export function getDatesBetween(start: string, end: string): string[] {
    const dates: string[] = [];
    const currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

/**
 * Get number of days between two dates
 */
export function getDaysBetween(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format date for display
 */
export function formatDate(dateStr: string, format: 'short' | 'medium' | 'long' = 'medium'): string {
    const date = new Date(dateStr);

    switch (format) {
        case 'short':
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        case 'medium':
            return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        case 'long':
            return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        default:
            return dateStr;
    }
}

/**
 * Check if a date is today
 */
export function isToday(dateStr: string): boolean {
    return dateStr === getToday();
}

/**
 * Get day of week (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeek(dateStr: string): number {
    return new Date(dateStr).getDay();
}

/**
 * Get week number of year
 */
export function getWeekNumber(dateStr: string): number {
    const date = new Date(dateStr);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Generate unique ID
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
