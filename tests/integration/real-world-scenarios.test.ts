/**
 * @fileoverview Integration tests for real-world usage scenarios
 */

import { TestRunner } from "../utils/test-helpers";
import { suppressConsole, restoreConsole } from "../../src/core/console-suppression";

const runner = new TestRunner();
const { console: mockConsole, env: envMock } = runner.getMocks();

// Test: Real application usage pattern
runner.test("Should work like a real application initialization", () => {
    envMock.setNodeEnv("production");

    // Simulate app startup
    console.log("App starting...");

    // Initialize console suppression (typically in main.js or index.js)
    const cleanup = suppressConsole({
        suppressAllInProd: true,
        preserveErrors: true
    });

    // App code that would normally log
    console.log("This should be suppressed");
    console.warn("This warning should be suppressed");
    console.error("This error should still show");
    console.debug("Debug info suppressed");
    console.info("Info suppressed");

    // Verify suppression
    if (mockConsole.getCallCount("log") !== 1) { // Only the initial "App starting..." should show
        throw new Error(`Expected 1 log call, got ${mockConsole.getCallCount("log")}`);
    }

    if (mockConsole.getCallCount("error") !== 1) {
        throw new Error(`Expected 1 error call, got ${mockConsole.getCallCount("error")}`);
    }

    if (mockConsole.getCallCount("warn") !== 0) {
        throw new Error(`Expected 0 warn calls, got ${mockConsole.getCallCount("warn")}`);
    }

    // Cleanup (typically on app shutdown)
    cleanup();

    // After cleanup, logging should work again
    console.log("App shutting down...");

    if (mockConsole.getCallCount("log") !== 2) {
        throw new Error(`Expected 2 log calls after cleanup, got ${mockConsole.getCallCount("log")}`);
    }
});

// Test: Library usage pattern
runner.test("Should work for library authors who want conditional suppression", () => {
    envMock.setNodeEnv("development");

    // Library code that wants to suppress only specific methods
    const cleanup = suppressConsole({
        methods: ["debug", "info"],
    });

    // Library internal logging
    console.log("User-facing log"); // Should show
    console.warn("User-facing warning"); // Should show
    console.error("User-facing error"); // Should show
    console.debug("Internal debug info"); // Should be suppressed
    console.info("Internal info"); // Should be suppressed

    if (!mockConsole.wasCalled("log")) {
        throw new Error("Log should not be suppressed");
    }

    if (!mockConsole.wasCalled("warn")) {
        throw new Error("Warn should not be suppressed");
    }

    if (!mockConsole.wasCalled("error")) {
        throw new Error("Error should not be suppressed");
    }

    if (mockConsole.wasCalled("debug")) {
        throw new Error("Debug should be suppressed");
    }

    if (mockConsole.wasCalled("info")) {
        throw new Error("Info should be suppressed");
    }

    cleanup();
});

// Test: Development vs Production behavior
runner.test("Should behave differently in development vs production", () => {
    // Development environment
    envMock.setNodeEnv("development");
    mockConsole.reset();

    let cleanup = suppressConsole(); // Default settings

    console.log("Dev log");
    console.error("Dev error");

    // In development, nothing should be suppressed by default
    if (!mockConsole.wasCalled("log")) {
        throw new Error("Dev logs should not be suppressed by default");
    }

    if (!mockConsole.wasCalled("error")) {
        throw new Error("Dev errors should not be suppressed");
    }

    cleanup();
    mockConsole.reset();

    // Production environment
    envMock.setNodeEnv("production");

    cleanup = suppressConsole(); // Default settings

    console.log("Prod log");
    console.error("Prod error");

    // In production, logs should be suppressed but errors preserved
    if (mockConsole.wasCalled("log")) {
        throw new Error("Prod logs should be suppressed by default");
    }

    if (!mockConsole.wasCalled("error")) {
        throw new Error("Prod errors should not be suppressed by default");
    }

    cleanup();
});

// Test: Framework integration pattern (React/Vue/Angular)
runner.test("Should work with framework error boundaries", () => {
    envMock.setNodeEnv("production");

    const cleanup = suppressConsole({
        suppressAllInProd: true,
        preserveErrors: true
    });

    // Simulate framework error handling
    try {
        console.log("About to throw error");
        throw new Error("Component error");
    } catch (error) {
        console.error("Framework caught error:", error.message);
        console.warn("Component will be replaced with error boundary");
    }

    // Framework logs should be suppressed
    if (mockConsole.wasCalled("log")) {
        throw new Error("Framework logs should be suppressed");
    }

    if (mockConsole.wasCalled("warn")) {
        throw new Error("Framework warnings should be suppressed");
    }

    // But errors should still be visible for debugging
    if (!mockConsole.wasCalled("error")) {
        throw new Error("Framework errors should be preserved");
    }

    cleanup();
});

// Test: Multiple library integration
runner.test("Should handle multiple libraries trying to suppress console", () => {
    envMock.setNodeEnv("production");

    // First library tries to suppress console
    const cleanup1 = suppressConsole({
        methods: ["log", "debug"]
    });

    console.log("Should be suppressed");
    console.debug("Should be suppressed");
    console.warn("Should not be suppressed");

    // Second library tries to suppress console (should be ignored due to singleton)
    const cleanup2 = suppressConsole({
        methods: ["warn", "info"]
    });

    console.warn("Should still not be suppressed"); // First suppression is active

    if (mockConsole.wasCalled("log")) {
        throw new Error("Log should be suppressed by first library");
    }

    if (mockConsole.wasCalled("debug")) {
        throw new Error("Debug should be suppressed by first library");
    }

    if (!mockConsole.wasCalled("warn")) {
        throw new Error("Warn should not be suppressed (not in first library's config)");
    }

    // First cleanup should restore console
    cleanup1();

    console.log("Should work after first cleanup");

    if (!mockConsole.wasCalled("log")) {
        throw new Error("Log should work after cleanup");
    }

    // Second cleanup should be safe to call
    cleanup2(); // Should not throw
});

// Test: Long-running application scenario
runner.test("Should work in long-running applications", () => {
    envMock.setNodeEnv("production");

    // Simulate multiple suppress/restore cycles over time
    for (let cycle = 0; cycle < 5; cycle++) {
        mockConsole.reset();

        const cleanup = suppressConsole({
            suppressAllInProd: true,
            preserveErrors: true
        });

        // Simulate application activity
        console.log(`Cycle ${cycle} activity`);
        console.error(`Cycle ${cycle} error`);

        if (mockConsole.wasCalled("log")) {
            throw new Error(`Cycle ${cycle}: logs should be suppressed`);
        }

        if (!mockConsole.wasCalled("error")) {
            throw new Error(`Cycle ${cycle}: errors should be preserved`);
        }

        cleanup();

        // After cleanup, console should work
        console.log(`Cycle ${cycle} cleanup test`);

        if (!mockConsole.wasCalled("log")) {
            throw new Error(`Cycle ${cycle}: logs should work after cleanup`);
        }
    }
});

// Test: Browser vs Node.js environment
runner.test("Should work consistently across environments", () => {
    // Test in Node.js-like environment
    envMock.setNodeEnv("production");

    let cleanup = suppressConsole();

    console.log("Node.js log");

    if (mockConsole.wasCalled("log")) {
        throw new Error("Should suppress in Node.js production");
    }

    cleanup();
    mockConsole.reset();

    // Test in browser-like environment
    envMock.mockBrowserEnvironment();

    cleanup = suppressConsole();

    console.log("Browser log");

    if (mockConsole.wasCalled("log")) {
        throw new Error("Should suppress in browser (treated as production)");
    }

    cleanup();
});

// Run tests
if (require.main === module) {
    runner.run().then(({ passed, failed }) => {
        process.exit(failed > 0 ? 1 : 0);
    });
}

export default runner;
