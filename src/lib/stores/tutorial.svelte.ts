import { browser } from '$app/environment';

export type TutorialPlatform = 'desktop' | 'mobile';

export type TutorialStatus = {
    firstPromptSeen: boolean;
    completed: boolean;
    skipped: boolean;
    lastCompletedAt?: string;
};

export type TutorialProgress = {
    flowId: string;
    stepIndex: number;
    isRunning: boolean;
};

export type TutorialState = {
    desktop: TutorialStatus;
    mobile: TutorialStatus;
    progress?: TutorialProgress;
    hasEverOpenedHub: boolean;
};

const STORAGE_KEY = 'selfos-tutorial-state-v1';

const DEFAULT_STATUS: TutorialStatus = {
    firstPromptSeen: false,
    completed: false,
    skipped: false
};

const DEFAULT_STATE: TutorialState = {
    desktop: { ...DEFAULT_STATUS },
    mobile: { ...DEFAULT_STATUS },
    hasEverOpenedHub: false
};

class TutorialStore {
    state = $state<TutorialState>(DEFAULT_STATE);
    showHub = $state(false);

    constructor() {
        if (browser) {
            this.load();
        }
    }

    private load() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                this.state = { ...DEFAULT_STATE, ...parsed };
            } catch (e) {
                console.error('Failed to parse tutorial state', e);
                this.state = DEFAULT_STATE;
            }
        }
    }

    save() {
        if (browser) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        }
    }

    get platform(): TutorialPlatform {
        if (!browser) return 'desktop';
        return window.innerWidth >= 768 ? 'desktop' : 'mobile';
    }

    get currentPlatformStatus(): TutorialStatus {
        return this.state[this.platform];
    }

    markPromptSeen() {
        this.state[this.platform].firstPromptSeen = true;
        this.save();
    }

    markCompleted() {
        this.state[this.platform].completed = true;
        this.state[this.platform].lastCompletedAt = new Date().toISOString();
        this.save();
    }

    markSkipped() {
        this.state[this.platform].skipped = true;
        this.save();
    }

    setHasOpenedHub() {
        this.state.hasEverOpenedHub = true;
        this.save();
    }

    startFlow(flowId: string) {
        this.state.progress = {
            flowId,
            stepIndex: 0,
            isRunning: true
        };
        this.save();
    }

    nextStep() {
        if (this.state.progress) {
            this.state.progress.stepIndex++;
            this.save();
        }
    }

    prevStep() {
        if (this.state.progress && this.state.progress.stepIndex > 0) {
            this.state.progress.stepIndex--;
            this.save();
        }
    }

    stopTutorial() {
        if (this.state.progress) {
            this.state.progress.isRunning = false;
            this.save();
        }
    }

    resetProgress() {
        this.state.progress = undefined;
        this.save();
    }
}

export const tutorialStore = new TutorialStore();
