import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import { tutorialStore } from '../stores/tutorial.svelte';
import { getFlowById, type TutorialStep } from './flows';
import { tick } from 'svelte';

class TutorialEngine {
    private pollInterval: number | null = null;
    private timeoutId: number | null = null;

    get isRunning() {
        return tutorialStore.state.progress?.isRunning ?? false;
    }

    get currentStep(): TutorialStep | undefined {
        const progress = tutorialStore.state.progress;
        if (!progress || !progress.isRunning) return undefined;

        const flow = getFlowById(progress.flowId);
        if (!flow) return undefined;

        return flow.steps[progress.stepIndex];
    }

    async startFlow(flowId: string) {
        tutorialStore.startFlow(flowId);
        await this.processCurrentStep();
    }

    async nextStep() {
        const progress = tutorialStore.state.progress;
        if (!progress) return;

        const flow = getFlowById(progress.flowId);
        if (!flow) return;

        if (progress.stepIndex < flow.steps.length - 1) {
            tutorialStore.nextStep();
            await this.processCurrentStep();
        } else {
            this.completeFlow();
        }
    }

    async prevStep() {
        tutorialStore.prevStep();
        await this.processCurrentStep();
    }

    stop() {
        tutorialStore.stopTutorial();
        this.clearTimers();
    }

    private completeFlow() {
        tutorialStore.markCompleted();
        tutorialStore.stopTutorial();
        this.clearTimers();
    }

    private async processCurrentStep() {
        this.clearTimers();
        const step = this.currentStep;
        if (!step) return;

        const currentPage = get(page);
        if (currentPage.url.pathname !== step.route) {
            await goto(step.route);
            await tick();
        }

        if (step.targetSelector) {
            this.waitForElement(step.targetSelector);
        }
    }

    private waitForElement(selector: string) {
        const startTime = Date.now();
        const timeout = tutorialStore.platform === 'desktop' ? 3000 : 4000;

        this.pollInterval = window.setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                this.clearTimers();
                // Element found, UI can anchor to it
            } else if (Date.now() - startTime > timeout) {
                this.clearTimers();
                console.warn(`Tutorial target not found: ${selector}. Showing fallback.`);
                // Element not found after timeout, UI will show fallback card
            }
        }, 100);
    }

    private clearTimers() {
        if (this.pollInterval) clearInterval(this.pollInterval);
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.pollInterval = null;
        this.timeoutId = null;
    }
}

export const tutorialEngine = new TutorialEngine();
