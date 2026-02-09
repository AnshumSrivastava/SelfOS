export class FocusStore {
    timeLeft = $state(25 * 60);
    isRunning = $state(false);
    mode = $state('focus'); // 'focus' | 'shortBreak' | 'longBreak'
    zenMode = $state(false);

    intervalId: number | null = null; // Browser returns number, Node returns object. In browser context number is fine.

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
                // Play check sound?
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
}

export const focusStore = new FocusStore();
