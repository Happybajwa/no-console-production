/**
 * @fileoverview Tests for console methods utilities
 */

import { TestRunner } from "../utils/test-helpers";
import {
    DEFAULT_CONSOLE_METHODS,
    NON_ERROR_CONSOLE_METHODS,
    getMethodsToSuppress,
    isValidConsoleMethod
} from "../../src/utils/console-methods";
import type { ConsoleMethod } from "../../src/types/console.types";

const runner = new TestRunner();

// Test: Default console methods constant
runner.test("Should have correct default console methods", () => {
    const expected = ["log", "warn", "error", "debug", "info"];
    const actual = [...DEFAULT_CONSOLE_METHODS];

    if (JSON.stringify(actual.sort()) !== JSON.stringify(expected.sort())) {
        throw new Error(`Expected ${expected}, got ${actual}`);
    }
});

// Test: Non-error console methods constant
runner.test("Should have correct non-error console methods", () => {
    const expected = ["log", "warn", "debug", "info"];
    const actual = [...NON_ERROR_CONSOLE_METHODS];

    if (JSON.stringify(actual.sort()) !== JSON.stringify(expected.sort())) {
        throw new Error(`Expected ${expected}, got ${actual}`);
    }

    // Should not include error
    if (NON_ERROR_CONSOLE_METHODS.includes("error" as any)) {
        throw new Error("Non-error methods should not include 'error'");
    }
});

// Test: getMethodsToSuppress with explicit methods
runner.test("Should return explicit methods when provided", () => {
    const methods: ConsoleMethod[] = ["log", "warn"];
    const options = { methods };
    const result = getMethodsToSuppress(options, true); // development

    if (JSON.stringify(result) !== JSON.stringify(["log", "warn"])) {
        throw new Error(`Expected ["log", "warn"], got ${JSON.stringify(result)}`);
    }

    const resultProd = getMethodsToSuppress(options, false); // production

    if (JSON.stringify(resultProd) !== JSON.stringify(["log", "warn"])) {
        throw new Error(`Expected ["log", "warn"] in prod, got ${JSON.stringify(resultProd)}`);
    }
});

// Test: getMethodsToSuppress in development with suppressAllInDev
runner.test("Should suppress methods in development when suppressAllInDev is true", () => {
    const options = { suppressAllInDev: true, preserveErrors: true };
    const result = getMethodsToSuppress(options, true);

    const expected = [...NON_ERROR_CONSOLE_METHODS];
    if (JSON.stringify(result.sort()) !== JSON.stringify(expected.sort())) {
        console.log("Expected:", expected);
        console.log("Got:", result);
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}`);
    }

    // Should not include error when preserveErrors is true
    if (result.includes("error")) {
        throw new Error("Should not include 'error' when preserveErrors is true");
    }
});// Test: getMethodsToSuppress in development without suppressAllInDev
runner.test("Should not suppress methods in development by default", () => {
    const options = {};
    const result = getMethodsToSuppress(options, true);

    if (result.length !== 0) {
        throw new Error(`Expected no suppression in dev, got ${JSON.stringify(result)}`);
    }
});

// Test: getMethodsToSuppress in production with suppressAllInProd
runner.test("Should suppress methods in production when suppressAllInProd is true", () => {
    const options = { suppressAllInProd: true, preserveErrors: true };
    const result = getMethodsToSuppress(options, false);

    const expected = [...NON_ERROR_CONSOLE_METHODS];
    if (JSON.stringify(result.sort()) !== JSON.stringify(expected.sort())) {
        console.log("Expected:", expected);
        console.log("Got:", result);
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}`);
    }

    // Should not include error when preserveErrors is true
    if (result.includes("error")) {
        throw new Error("Should not include 'error' when preserveErrors is true");
    }
});// Test: getMethodsToSuppress in production without suppressAllInProd
runner.test("Should not suppress methods in production when suppressAllInProd is false", () => {
    const options = { suppressAllInProd: false };
    const result = getMethodsToSuppress(options, false);

    if (result.length !== 0) {
        throw new Error(`Expected no suppression when disabled, got ${JSON.stringify(result)}`);
    }
});

// Test: getMethodsToSuppress with preserveErrors false
runner.test("Should include error methods when preserveErrors is false", () => {
    const options = { suppressAllInProd: true, preserveErrors: false };
    const result = getMethodsToSuppress(options, false);

    const expected = [...DEFAULT_CONSOLE_METHODS];
    if (JSON.stringify(result.sort()) !== JSON.stringify(expected.sort())) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}`);
    }

    if (!result.includes("error")) {
        throw new Error("Should include 'error' when preserveErrors is false");
    }
});

// Test: getMethodsToSuppress with preserveErrors true (default)
runner.test("Should exclude error methods when preserveErrors is true", () => {
    const options = { suppressAllInProd: true, preserveErrors: true };
    const result = getMethodsToSuppress(options, false);

    if (result.includes("error")) {
        throw new Error("Should not include 'error' when preserveErrors is true");
    }

    const expected = [...NON_ERROR_CONSOLE_METHODS];
    if (JSON.stringify(result.sort()) !== JSON.stringify(expected.sort())) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}`);
    }
});

// Test: isValidConsoleMethod with valid methods
runner.test("Should validate existing console methods", () => {
    const validMethods: ConsoleMethod[] = ["log", "warn", "error", "debug", "info"];

    for (const method of validMethods) {
        if (!isValidConsoleMethod(method)) {
            throw new Error(`Expected ${method} to be valid console method`);
        }
    }
});

// Test: isValidConsoleMethod with invalid method
runner.test("Should handle invalid console methods", () => {
    // Temporarily remove a console method
    const originalMethod = console.debug;
    delete (console as any).debug;

    try {
        if (isValidConsoleMethod("debug")) {
            throw new Error("Should return false for non-existent console method");
        }
    } finally {
        // Restore the method
        console.debug = originalMethod;
    }
});

// Test: Complex configuration scenarios
runner.test("Should handle complex configuration scenarios", () => {
    // Scenario 1: Explicit methods override environment settings
    const explicitMethods: ConsoleMethod[] = ["log"];
    const scenario1 = getMethodsToSuppress({
        methods: explicitMethods,
        suppressAllInDev: true,
        suppressAllInProd: true,
        preserveErrors: false
    }, true);

    if (JSON.stringify(scenario1) !== JSON.stringify(["log"])) {
        throw new Error("Explicit methods should override all other settings");
    }

    // Scenario 2: No suppression when all flags are false
    const scenario2 = getMethodsToSuppress({
        suppressAllInDev: false,
        suppressAllInProd: false
    }, false);

    if (scenario2.length !== 0) {
        throw new Error("Should not suppress when all flags are false");
    }

    // Scenario 3: Development with suppressAllInDev but preserveErrors false
    const scenario3 = getMethodsToSuppress({
        suppressAllInDev: true,
        preserveErrors: false
    }, true);

    const expectedScenario3 = [...DEFAULT_CONSOLE_METHODS];
    if (JSON.stringify(scenario3.sort()) !== JSON.stringify(expectedScenario3.sort())) {
        throw new Error("Should suppress all methods including errors when preserveErrors is false");
    }
});

// Run tests
if (require.main === module) {
    runner.run().then(({ passed, failed }) => {
        process.exit(failed > 0 ? 1 : 0);
    });
}

export default runner;
