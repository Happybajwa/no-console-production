/**
 * @fileoverview Test utilities for console suppression testing
 */

import type { ConsoleMethod } from "../../src/types/console.types";

/**
 * Mock console methods for testing
 */
export class MockConsole {
    private calls: Map<ConsoleMethod, any[][]> = new Map();
    private originalConsole: Partial<Console> = {};

    constructor() {
        this.reset();
    }

    /**
     * Setup mock console and capture calls
     */
    setup(): void {
        const methods: ConsoleMethod[] = ["log", "warn", "error", "debug", "info"];

        methods.forEach((method) => {
            this.originalConsole[method] = console[method];
            this.calls.set(method, []);

            (console as any)[method] = (...args: any[]) => {
                this.calls.get(method)?.push(args);
            };
        });
    }

    /**
     * Restore original console methods
     */
    restore(): void {
        Object.entries(this.originalConsole).forEach(([method, originalFn]) => {
            if (originalFn) {
                (console as any)[method] = originalFn;
            }
        });
    }

    /**
     * Reset call tracking
     */
    reset(): void {
        this.calls.clear();
        const methods: ConsoleMethod[] = ["log", "warn", "error", "debug", "info"];
        methods.forEach((method) => this.calls.set(method, []));
    }

    /**
     * Get calls for a specific console method
     */
    getCalls(method: ConsoleMethod): any[][] {
        return this.calls.get(method) || [];
    }

    /**
     * Get total number of calls for a method
     */
    getCallCount(method: ConsoleMethod): number {
        return this.getCalls(method).length;
    }

    /**
     * Check if a method was called
     */
    wasCalled(method: ConsoleMethod): boolean {
        return this.getCallCount(method) > 0;
    }

    /**
     * Get all calls across all methods
     */
    getAllCalls(): Record<ConsoleMethod, any[][]> {
        const result = {} as Record<ConsoleMethod, any[][]>;
        this.calls.forEach((calls, method) => {
            result[method] = calls;
        });
        return result;
    }
}

/**
 * Environment mock for testing different NODE_ENV values
 */
export class EnvironmentMock {
    private originalNodeEnv: string | undefined;
    private originalProcess: typeof process | undefined;

    /**
     * Set NODE_ENV for testing
     */
    setNodeEnv(env: string | undefined): void {
        this.originalNodeEnv = process?.env?.NODE_ENV;

        if (typeof process !== "undefined" && process.env) {
            if (env === undefined) {
                delete process.env.NODE_ENV;
            } else {
                process.env.NODE_ENV = env;
            }
        }
    }

    /**
     * Mock process object for browser-like environment
     */
    mockBrowserEnvironment(): void {
        this.originalProcess = (global as any).process;
        (global as any).process = undefined;
    }

    /**
     * Restore original environment
     */
    restore(): void {
        if (this.originalNodeEnv !== undefined) {
            if (typeof process !== "undefined" && process.env) {
                process.env.NODE_ENV = this.originalNodeEnv;
            }
        }

        if (this.originalProcess !== undefined) {
            (global as any).process = this.originalProcess;
        }
    }
}

/**
 * Test assertion helpers
 */
export const assertions = {
    /**
     * Assert that console method was called with specific arguments
     */
    assertCalled(
        mockConsole: MockConsole,
        method: ConsoleMethod,
        expectedArgs?: any[]
    ): void {
        const calls = mockConsole.getCalls(method);
        if (calls.length === 0) {
            throw new Error(`Expected console.${method} to be called, but it wasn't`);
        }

        if (expectedArgs) {
            const lastCall = calls[calls.length - 1];
            if (JSON.stringify(lastCall) !== JSON.stringify(expectedArgs)) {
                throw new Error(
                    `Expected console.${method} to be called with ${JSON.stringify(expectedArgs)}, ` +
                    `but was called with ${JSON.stringify(lastCall)}`
                );
            }
        }
    },

    /**
     * Assert that console method was NOT called
     */
    assertNotCalled(mockConsole: MockConsole, method: ConsoleMethod): void {
        const calls = mockConsole.getCalls(method);
        if (calls.length > 0) {
            throw new Error(
                `Expected console.${method} NOT to be called, but it was called ${calls.length} times`
            );
        }
    },

    /**
     * Assert call count
     */
    assertCallCount(
        mockConsole: MockConsole,
        method: ConsoleMethod,
        expectedCount: number
    ): void {
        const actualCount = mockConsole.getCallCount(method);
        if (actualCount !== expectedCount) {
            throw new Error(
                `Expected console.${method} to be called ${expectedCount} times, ` +
                `but was called ${actualCount} times`
            );
        }
    },
};

/**
 * Test runner utility
 */
export class TestRunner {
    private tests: Array<{ name: string; fn: () => void | Promise<void> }> = [];
    private mockConsole = new MockConsole();
    private envMock = new EnvironmentMock();

    /**
     * Add a test case
     */
    test(name: string, fn: () => void | Promise<void>): void {
        this.tests.push({ name, fn });
    }

    /**
     * Run all tests
     */
    async run(): Promise<{ passed: number; failed: number; results: Array<{ name: string; success: boolean; error?: string }> }> {
        const results: Array<{ name: string; success: boolean; error?: string }> = [];
        let passed = 0;
        let failed = 0;

        console.log(`\n🧪 Running ${this.tests.length} tests...\n`);

        for (const test of this.tests) {
            try {
                // Setup fresh environment for each test
                this.mockConsole.setup();
                this.mockConsole.reset();

                await test.fn();

                results.push({ name: test.name, success: true });
                passed++;
                console.log(`✅ ${test.name}`);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                results.push({ name: test.name, success: false, error: errorMessage });
                failed++;
                console.log(`❌ ${test.name}: ${errorMessage}`);
            } finally {
                // Cleanup after each test
                this.mockConsole.restore();
                this.envMock.restore();
            }
        }

        console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);

        return { passed, failed, results };
    }

    /**
     * Get mock instances for tests
     */
    getMocks() {
        return {
            console: this.mockConsole,
            env: this.envMock,
            assertions,
        };
    }
}
