import { LocalStore } from './localStore.svelte';

export type CalendarEvent = {
    id: string;
    title: string;
    description?: string;
    date: string; // ISO Date (YYYY-MM-DD or full ISO)
    startTime?: string; // HH:mm
    endTime?: string; // HH:mm
    type: 'meeting' | 'event' | 'reminder' | 'task';
    location?: string;
    color?: string; // Hex or CSS color
    isAllDay?: boolean;
};

const DEFAULT_EVENTS: CalendarEvent[] = [
    {
        id: '1',
        title: "Team Sync",
        description: "Weekly sync with design team",
        date: new Date().toISOString().split('T')[0],
        startTime: "10:00",
        endTime: "11:00",
        type: "meeting",
        location: "Google Meet",
        color: "#3b82f6"
    },
    {
        id: '2',
        title: "Doctor Appointment",
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        startTime: "14:30",
        endTime: "15:30",
        type: "event",
        location: "City Clinic",
        color: "#ef4444"
    }
];

class CalendarStore {
    store = new LocalStore<CalendarEvent[]>('selfos_calendar_v2', DEFAULT_EVENTS);

    get events() {
        return this.store.value;
    }

    add(event: Omit<CalendarEvent, 'id'>) {
        this.store.value = [...this.store.value, { ...event, id: crypto.randomUUID() }];
    }

    update(id: string, updates: Partial<CalendarEvent>) {
        this.store.value = this.store.value.map(e => e.id === id ? { ...e, ...updates } : e);
    }

    remove(id: string) {
        this.store.value = this.store.value.filter(e => e.id !== id);
    }

    getEventsByDate(dateStr: string) {
        // dateStr should be YYYY-MM-DD
        return this.store.value.filter(e => e.date.startsWith(dateStr));
    }
}

export const calendarStore = new CalendarStore();
