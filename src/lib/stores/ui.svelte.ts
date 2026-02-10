export class UIState {
    showChrome = $state(true);

    toggleChrome() {
        this.showChrome = !this.showChrome;
    }
}

export const uiState = new UIState();
