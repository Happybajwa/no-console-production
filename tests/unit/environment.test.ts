/**
 * @fileoverview Tests for environment detection utilities
 */

import { TestRunner } from "../utils/test-helpers";
import { detectEnvironment, isProduction, isDevelopment } from "../../src/utils/environment";

const runner = new TestRunner();
const { env: envMock } = runner.getMocks();

// Test: Development environment detection
runner.test("Should correctly detect development environment", () => {
  envMock.setNodeEnv("development");
  
  const env = detectEnvironment();
  
  if (!env.isDevelopment) {
    throw new Error("Should detect development environment");
  }
  
  if (env.nodeEnv !== "development") {
    throw new Error(`Expected NODE_ENV to be 'development', got '${env.nodeEnv}'`);
  }
  
  if (!isDevelopment()) {
    throw new Error("isDevelopment() should return true");
  }
  
  if (isProduction()) {
    throw new Error("isProduction() should return false");
  }
});

// Test: Production environment detection
runner.test("Should correctly detect production environment", () => {
  envMock.setNodeEnv("production");
  
  const env = detectEnvironment();
  
  if (env.isDevelopment) {
    throw new Error("Should not detect as development environment");
  }
  
  if (env.nodeEnv !== "production") {
    throw new Error(`Expected NODE_ENV to be 'production', got '${env.nodeEnv}'`);
  }
  
  if (isDevelopment()) {
    throw new Error("isDevelopment() should return false");
  }
  
  if (!isProduction()) {
    throw new Error("isProduction() should return true");
  }
});

// Test: Test environment detection
runner.test("Should treat test environment as production", () => {
  envMock.setNodeEnv("test");
  
  const env = detectEnvironment();
  
  if (env.isDevelopment) {
    throw new Error("Should not detect test as development environment");
  }
  
  if (env.nodeEnv !== "test") {
    throw new Error(`Expected NODE_ENV to be 'test', got '${env.nodeEnv}'`);
  }
  
  if (isDevelopment()) {
    throw new Error("isDevelopment() should return false for test env");
  }
  
  if (!isProduction()) {
    throw new Error("isProduction() should return true for test env");
  }
});

// Test: Undefined NODE_ENV
runner.test("Should treat undefined NODE_ENV as production", () => {
  envMock.setNodeEnv(undefined);
  
  const env = detectEnvironment();
  
  if (env.isDevelopment) {
    throw new Error("Should not detect undefined NODE_ENV as development");
  }
  
  if (env.nodeEnv !== undefined) {
    throw new Error(`Expected NODE_ENV to be undefined, got '${env.nodeEnv}'`);
  }
  
  if (isDevelopment()) {
    throw new Error("isDevelopment() should return false for undefined NODE_ENV");
  }
  
  if (!isProduction()) {
    throw new Error("isProduction() should return true for undefined NODE_ENV");
  }
});

// Test: Browser environment (no process)
runner.test("Should handle browser environment without process object", () => {
  envMock.mockBrowserEnvironment();
  
  const env = detectEnvironment();
  
  if (env.isDevelopment) {
    throw new Error("Should not detect browser environment as development");
  }
  
  if (env.nodeEnv !== undefined) {
    throw new Error(`Expected NODE_ENV to be undefined in browser, got '${env.nodeEnv}'`);
  }
  
  if (isDevelopment()) {
    throw new Error("isDevelopment() should return false in browser");
  }
  
  if (!isProduction()) {
    throw new Error("isProduction() should return true in browser");
  }
});

// Test: Custom environment names
runner.test("Should treat custom environment names as production", () => {
  const customEnvs = ["staging", "uat", "preview", "local"];
  
  for (const customEnv of customEnvs) {
    envMock.setNodeEnv(customEnv);
    
    const env = detectEnvironment();
    
    if (env.isDevelopment) {
      throw new Error(`Should not detect '${customEnv}' as development environment`);
    }
    
    if (env.nodeEnv !== customEnv) {
      throw new Error(`Expected NODE_ENV to be '${customEnv}', got '${env.nodeEnv}'`);
    }
    
    if (isDevelopment()) {
      throw new Error(`isDevelopment() should return false for '${customEnv}' env`);
    }
    
    if (!isProduction()) {
      throw new Error(`isProduction() should return true for '${customEnv}' env`);
    }
  }
});

// Run tests
if (require.main === module) {
  runner.run().then(({ passed, failed }) => {
    process.exit(failed > 0 ? 1 : 0);
  });
}

export default runner;
