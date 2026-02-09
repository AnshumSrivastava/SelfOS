import { browser } from '$app/environment';

export class LocalStore<T> {
    value = $state<T>() as T;
    key = '';

    constructor(key: string, initialValue: T) {
        this.key = key;
        this.value = initialValue;

        if (browser) {
            const stored = localStorage.getItem(key);
            if (stored) {
                try {
                    this.value = JSON.parse(stored);
                } catch (e) {
                    console.error(`Error parsing localStorage key "${key}":`, e);
                }
            } else {
                // Initialize localStorage if empty
                localStorage.setItem(key, JSON.stringify(initialValue));
            }

            $effect.root(() => {
                $effect(() => {
                    localStorage.setItem(this.key, JSON.stringify(this.value));
                });
            });
        }
    }
}
