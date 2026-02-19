import { supabase } from '$lib/supabaseClient';
import { auth } from './auth.svelte';

export class FocusStore {
    timeLeft = $state(25 * 60);
    isRunning = $state(false);
    mode = $state('focus'); // 'focus' | 'shortBreak' | 'longBreak'
    zenMode = $state(false);

    intervalId: any = null; // Browser returns number, Node returns object. In browser context number is fine.

    // Derived values
    get minutes() {
        return Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
    }

    get seconds() {
        return (this.timeLeft % 60).toString().padStart(2, '0');
    }

    get formattedTime() {
        return `${this.minutes}:${this.seconds}`;
    }

    constructor() {
        // Initialize if needed
    }

    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
            this.zenMode = true; // Enter Zen Mode when starting
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                this.pause();
                this.sessionComplete = true; // Trigger completion
                this.zenMode = true; // Ensure zen mode stays or re-activates if we want the overlay? Actually overlay is separate. 
                // Wait, if session complete, we likely want to show the overlay.
                // Zen mode overlay shows timer. 
                // Session complete overlay will be handled in layout.
            }
        }, 1000);
    }

    pause() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    reset() {
        this.pause();
        this.zenMode = false;
        if (this.mode === 'focus') this.timeLeft = 25 * 60;
        else if (this.mode === 'shortBreak') this.timeLeft = 5 * 60;
        else if (this.mode === 'longBreak') this.timeLeft = 15 * 60;
    }

    setMode(mode: 'focus' | 'shortBreak' | 'longBreak') {
        this.mode = mode;
        this.reset();
    }

    toggleZenMode() {
        this.zenMode = !this.zenMode;
    }

    exitZen() {
        this.pause();
        this.zenMode = false;
    }

    sessionComplete = $state(false);
    todayFocusMinutes = $state(0);

    setDuration(minutes: number) {
        this.pause();
        this.timeLeft = minutes * 60;
        // If mode is custom, we might want to track that, but for now just updating time is enough
    }

    async fetchTodayStats() {
        if (!auth.isAuthenticated) return;
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('focus_sessions')
            .select('duration')
            .eq('user_id', auth.user?.id)
            .gte('date', today);

        if (!error && data) {
            this.todayFocusMinutes = data.reduce((acc: number, s: any) => acc + (s.duration || 0), 0);
        }
    }

    async logSession(subject: string) {
        if (!auth.isAuthenticated) return;

        const duration = Math.floor((this.mode === 'focus' ? 25 * 60 - this.timeLeft : 0) / 60); // Simplified calculation

        const { error } = await supabase.from('focus_sessions').insert({
            user_id: auth.user?.id,
            subject,
            duration,
            mode: this.mode,
            date: new Date().toISOString()
        });

        if (error) {
            console.error("Error logging focus session:", error);
        } else {
            console.log(`Session logged to Supabase: ${subject}`);
            this.todayFocusMinutes += duration;
        }

        this.sessionComplete = false;
        this.reset();
    }
}

export const focusStore = new FocusStore();
