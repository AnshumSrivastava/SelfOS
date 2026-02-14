import { browser } from "$app/environment";

export class UIState {
    showChrome = $state(true);
    isCollapsed = $state(false);

    constructor() {
        if (browser) {
            const saved = localStorage.getItem("selfos-sidebar-collapsed");
            if (saved) {
                this.isCollapsed = JSON.parse(saved);
            }
        }
    }

    toggleChrome() {
        this.showChrome = !this.showChrome;
    }

    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        if (browser) {
            localStorage.setItem("selfos-sidebar-collapsed", JSON.stringify(this.isCollapsed));
        }
    }
}

export const uiState = new UIState();
