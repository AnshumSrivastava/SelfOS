export class ConfirmState {
    isOpen = $state(false);
    title = $state("");
    message = $state("");
    resolve: ((value: boolean) => void) | null = null;

    async confirm(title: string, message: string): Promise<boolean> {
        this.title = title;
        this.message = message;
        this.isOpen = true;

        return new Promise((resolve) => {
            this.resolve = resolve;
        });
    }

    handleConfirm() {
        if (this.resolve) this.resolve(true);
        this.isOpen = false;
        this.reset();
    }

    handleCancel() {
        if (this.resolve) this.resolve(false);
        this.isOpen = false;
        this.reset();
    }

    reset() {
        this.resolve = null;
        setTimeout(() => {
            this.title = "";
            this.message = "";
        }, 300);
    }
}

export const confirmState = new ConfirmState();
