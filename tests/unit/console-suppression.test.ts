/**
 * @fileoverview Unit tests for core console suppression functionality
 */

import { TestRunner } from "../utils/test-helpers";
import {
    suppressConsole,
    restoreConsole,
    isConsoleSuppressionActive,
    getSuppressedMethods
} from "../../src/core/console-suppression";

const runner = new TestRunner();
const { console: mockConsole, env: envMock, assertions } = runner.getMocks();

// Test: Default behavior in development
runner.test("Should not suppress any methods in development by default", () => {
    envMock.setNodeEnv("development");

    const restore = suppressConsole();

    console.log("test log");
    console.warn("test warn");
    console.error("test error");

    assertions.assertCalled(mockConsole, "log", ["test log"]);
    assertions.assertCalled(mockConsole, "warn", ["test warn"]);
    assertions.assertCalled(mockConsole, "error", ["test error"]);

    // Should not be active since nothing was suppressed
    if (isConsoleSuppressionActive()) {
        throw new Error("Suppression should not be active in development by default");
    }

    restore();
});

// Test: Default behavior in production
runner.test("Should suppress non-error methods in production by default", () => {
    envMock.setNodeEnv("production");

    const restore = suppressConsole();

    console.log("test log");
    console.warn("test warn");
    console.error("test error");
    console.debug("test debug");
    console.info("test info");

    assertions.assertNotCalled(mockConsole, "log");
    assertions.assertNotCalled(mockConsole, "warn");
    assertions.assertNotCalled(mockConsole, "debug");
    assertions.assertNotCalled(mockConsole, "info");
    assertions.assertCalled(mockConsole, "error", ["test error"]);

    if (!isConsoleSuppressionActive()) {
        throw new Error("Suppression should be active in production");
    }

    const suppressed = getSuppressedMethods();
    const expected = ["log", "warn", "debug", "info"];
    if (JSON.stringify(suppressed.sort()) !== JSON.stringify(expected.sort())) {
        throw new Error(`Expected suppressed methods: ${expected}, got: ${suppressed}`);
    }

    restore();
});

// Test: Explicit methods suppression
runner.test("Should suppress only specified methods when explicitly provided", () => {
    envMock.setNodeEnv("development");

    const restore = suppressConsole({ methods: ["log", "warn"] });

    console.log("test log");
    console.warn("test warn");
    console.error("test error");
    console.debug("test debug");

    assertions.assertNotCalled(mockConsole, "log");
    assertions.assertNotCalled(mockConsole, "warn");
    assertions.assertCalled(mockConsole, "error", ["test error"]);
    assertions.assertCalled(mockConsole, "debug", ["test debug"]);

    if (!isConsoleSuppressionActive()) {
        throw new Error("Suppression should be active when methods are specified");
    }

    restore();
});

// Test: suppressAllInDev option
runner.test("Should suppress all methods in development when suppressAllInDev is true", () => {
    envMock.setNodeEnv("development");

    const restore = suppressConsole({ suppressAllInDev: true });

    console.log("test log");
    console.warn("test warn");
    console.error("test error");

    assertions.assertNotCalled(mockConsole, "log");
    assertions.assertNotCalled(mockConsole, "warn");
    assertions.assertCalled(mockConsole, "error", ["test error"]); // preserveErrors is true by default

    restore();
});

// Test: preserveErrors option
runner.test("Should suppress error methods when preserveErrors is false", () => {
    envMock.setNodeEnv("production");

    const restore = suppressConsole({ preserveErrors: false });

    console.log("test log");
    console.error("test error");

    assertions.assertNotCalled(mockConsole, "log");
    assertions.assertNotCalled(mockConsole, "error");

    restore();
});

// Test: Singleton behavior
runner.test("Should return cleanup function without double suppression", () => {
    envMock.setNodeEnv("production");

    const restore1 = suppressConsole();
    const restore2 = suppressConsole(); // Second call should return cleanup

    console.log("test log");

    assertions.assertNotCalled(mockConsole, "log");

    if (!isConsoleSuppressionActive()) {
        throw new Error("Suppression should still be active");
    }

    // Both restore functions should work
    restore1();

    if (isConsoleSuppressionActive()) {
        throw new Error("Suppression should be inactive after restore");
    }

    restore2(); // Should not throw
});

// Test: Restore functionality
runner.test("Should restore original console methods", () => {
    envMock.setNodeEnv("production");

    const restore = suppressConsole();

    console.log("test log");
    assertions.assertNotCalled(mockConsole, "log");

    restore();

    console.log("test log after restore");
    assertions.assertCalled(mockConsole, "log", ["test log after restore"]);

    if (isConsoleSuppressionActive()) {
        throw new Error("Suppression should be inactive after restore");
    }

    if (getSuppressedMethods().length > 0) {
        throw new Error("No methods should be suppressed after restore");
    }
});

// Test: Browser environment (no process object)
runner.test("Should work in browser environment without process object", () => {
    envMock.mockBrowserEnvironment();

    const restore = suppressConsole();

    console.log("test log");
    console.error("test error");

    // In browser without NODE_ENV, should treat as production
    assertions.assertNotCalled(mockConsole, "log");
    assertions.assertCalled(mockConsole, "error", ["test error"]);

    restore();
});

// Test: No suppression when conditions not met
runner.test("Should not suppress when no conditions are met", () => {
    envMock.setNodeEnv("development");

    const restore = suppressConsole({
        suppressAllInDev: false,
        suppressAllInProd: false
    });

    console.log("test log");
    console.error("test error");

    assertions.assertCalled(mockConsole, "log", ["test log"]);
    assertions.assertCalled(mockConsole, "error", ["test error"]);

    if (isConsoleSuppressionActive()) {
        throw new Error("Suppression should not be active");
    }

    restore(); // Should be no-op
});

// Test: Invalid console methods
runner.test("Should handle invalid console methods gracefully", () => {
    envMock.setNodeEnv("production");

    // Temporarily remove a console method
    const originalDebug = console.debug;
    delete (console as any).debug;

    const restore = suppressConsole();

    console.log("test log");

    assertions.assertNotCalled(mockConsole, "log");

    restore();

    // Restore the method
    console.debug = originalDebug;
});

// Test: Multiple suppress/restore cycles
runner.test("Should handle multiple suppress/restore cycles", () => {
    envMock.setNodeEnv("production");

    for (let i = 0; i < 3; i++) {
        const restore = suppressConsole();

        console.log(`test log ${i}`);
        assertions.assertCallCount(mockConsole, "log", i); // Should still be suppressed

        restore();

        console.log(`test log after restore ${i}`);
        assertions.assertCallCount(mockConsole, "log", i + 1);
    }
});

// Run tests
if (require.main === module) {
    runner.run().then(({ passed, failed }) => {
        process.exit(failed > 0 ? 1 : 0);
    });
}

export default runner;
