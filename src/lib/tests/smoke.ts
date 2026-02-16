import { logger } from '$lib/services/logger';
import { syncStore } from '$lib/stores/sync.svelte';

export function runSmokeTests() {
    console.group('--- SELFOS SMOKE TESTS ---');

    try {
        // 1. Logger Tests
        logger.info('SYSTEM', 'Smoke test initialized');
        logger.warn('UI', 'Verification in progress');

        const history = logger.getHistory();
        if (history.length < 2) throw new Error('Logger failed to record entries');
        console.log('✅ Logger verified');

        // 2. SyncStore Tests
        const testStoreId = 'smoke_test_store';
        syncStore.register(testStoreId, 'Smoke Test Table');

        if (!syncStore.registry[testStoreId]) throw new Error('Store registration failed');
        console.log('✅ SyncStore registration verified');

        syncStore.updateStatus(testStoreId, 'saving');
        if ((syncStore.globalStatus as string) !== 'syncing') throw new Error('Global status failed to reflect syncing state');
        console.log('✅ Global "syncing" state verified');

        syncStore.updateStatus(testStoreId, 'error', 'Simulated Error');
        if ((syncStore.globalStatus as string) !== 'error') throw new Error('Global status failed to reflect error state');
        console.log('✅ Global "error" state verified');

        syncStore.updateStatus(testStoreId, 'idle');
        if ((syncStore.globalStatus as string) !== 'stable') throw new Error('Global status failed to return to stable');
        console.log('✅ Global "stable" state verified');

        console.log('🚀 ALL PHASE 3 SMOKE TESTS PASSED');
    } catch (error) {
        console.error('❌ SMOKE TEST FAILED:', error);
        logger.error('SYSTEM', 'Smoke test failed', error);
    } finally {
        console.groupEnd();
    }
}
