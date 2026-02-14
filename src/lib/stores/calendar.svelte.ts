import { SupabaseStore } from './supabaseStore.svelte';

export type CalendarEvent = {
    id: string;
    title: string;
    description?: string;
    date: string; // YYYY-MM-DD
    startTime?: string; // HH:mm
    endTime?: string; // HH:mm
    type: 'meeting' | 'event' | 'reminder' | 'task';
    location?: string;
    color?: string;
    isAllDay?: boolean;
    createdAt?: string;
};

class CalendarStore {
    private store = new SupabaseStore<CalendarEvent>('calendar_events');

    get events() {
        return this.store.value;
    }

    get loading() {
        return this.store.loading;
    }

    async add(event: Omit<CalendarEvent, 'id'>) {
        await this.store.insert(event);
    }

    async update(id: string, updates: Partial<CalendarEvent>) {
        await this.store.update(id, updates);
    }

    async remove(id: string) {
        await this.store.delete(id);
    }

    getEventsByDate(dateStr: string) {
        return this.store.value.filter(e => e.date && e.date.startsWith(dateStr));
    }
}

export const calendarStore = new CalendarStore();
