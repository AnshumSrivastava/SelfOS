/**
 * Utility functions for date manipulation
 */

/**
 * Gets an array of day objects for a specific month, including padding for the first week.
 * @param year - The year (e.g., 2024)
 * @param month - The 0-indexed month (0 = January)
 * @returns Array of day objects with date, dayNumber, and isCurrentMonth status
 */
export function getDaysInMonth(year: number, month: number) {
    // month is 0-indexed (0 = Jan, 11 = Dec)
    const date = new Date(year, month, 1);
    const days = [];

    // Get the first day of the week (0 = Sunday, 6 = Saturday)
    const firstDay = date.getDay();

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        days.push({ date: null, isCurrentMonth: false });
    }

    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= lastDay; i++) {
        days.push({
            date: new Date(year, month, i),
            dayNumber: i,
            isCurrentMonth: true
        });
    }

    return days;
}

/**
 * Formats a date into a "Month Year" string (e.g., "January 2024").
 * @param date - The Date object to format
 * @returns Formatted month/year string
 */
export function formatMonthYear(date: Date) {
    return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
}

/**
 * Formats a date into an ISO string format (YYYY-MM-DD).
 * @param date - The Date object to format
 * @returns ISO date string
 */
export function formatDateISO(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Checks if two dates refer to the same calendar day.
 * @param d1 - First date to compare
 * @param d2 - Second date to compare
 * @returns True if both dates are the same day
 */
export function isSameDay(d1: Date | null | undefined, d2: Date | null | undefined) {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

/**
 * Returns a new Date object representing the current moment.
 */
export function getToday() {
    return new Date();
}

/**
 * Calculates a date relative to the current date by a number of days.
 * @param days - Number of days to add (positive) or subtract (negative)
 * @returns Resulting Date object
 */
export function getRelativeDate(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
}

/**
 * Formats a date into a short time string (e.g., "12:30 PM").
 * @param date - The Date object to format
 * @returns Formatted time string
 */
export function getTimeString(date: Date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
