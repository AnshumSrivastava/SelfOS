/**
 * Utility functions for date manipulation
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

export function formatMonthYear(date: Date) {
    return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
}

export function formatDateISO(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function isSameDay(d1: Date | null | undefined, d2: Date | null | undefined) {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

export function getToday() {
    return new Date();
}

export function getRelativeDate(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
}

export function getTimeString(date: Date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
