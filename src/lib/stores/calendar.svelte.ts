import { LocalStore } from './localStore.svelte';

export type CalendarEvent = {
    id: string;
    title: string;
    description?: string;
    date: string; // ISO String
    type: 'meeting' | 'event' | 'reminder';
    location?: string;
};

const DEFAULT_EVENTS: CalendarEvent[] = [
    {
        id: '1',
        title: "Team Sync",
        description: "Weekly sync with design team",
        date: new Date().toISOString(),
        type: "meeting",
        location: "Google Meet"
    },
    {
        id: '2',
        title: "Doctor Appointment",
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        type: "event",
        location: "City Clinic"
    }
];

class CalendarStore {
    store = new LocalStore<CalendarEvent[]>('selfos_calendar', DEFAULT_EVENTS);

    get events() {
        return this.store.value;
    }

    add(event: Omit<CalendarEvent, 'id'>) {
        this.store.value = [...this.store.value, { ...event, id: crypto.randomUUID() }];
    }
}

export const calendarStore = new CalendarStore();
