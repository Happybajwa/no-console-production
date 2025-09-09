/**
 * @fileoverview Main test runner for all test suites
 */

import consoleSuppressionTests from "./unit/console-suppression.test";
import environmentTests from "./unit/environment.test";
import consoleMethodsTests from "./unit/console-methods.test";
import integrationTests from "./integration/real-world-scenarios.test";

/**
 * Run all test suites
 */
async function runAllTests(): Promise<void> {
  console.log("🚀 Starting comprehensive test suite for no-console-production\n");
  
  const testSuites = [
    { name: "Core Console Suppression", runner: consoleSuppressionTests },
    { name: "Environment Detection", runner: environmentTests },
    { name: "Console Methods Utilities", runner: consoleMethodsTests },
    { name: "Real-world Integration", runner: integrationTests },
  ];
  
  let totalPassed = 0;
  let totalFailed = 0;
  const allResults: Array<{ suite: string; passed: number; failed: number; details: any[] }> = [];
  
  for (const suite of testSuites) {
    console.log(`\n📋 Running ${suite.name} tests...`);
    console.log("=".repeat(50));
    
    try {
      const result = await suite.runner.run();
      totalPassed += result.passed;
      totalFailed += result.failed;
      
      allResults.push({
        suite: suite.name,
        passed: result.passed,
        failed: result.failed,
        details: result.results,
      });
      
      if (result.failed > 0) {
        console.log(`\n❌ ${suite.name}: ${result.failed} test(s) failed`);
      } else {
        console.log(`\n✅ ${suite.name}: All tests passed`);
      }
    } catch (error) {
      console.error(`\n💥 ${suite.name}: Test suite crashed:`, error);
      totalFailed++;
      
      allResults.push({
        suite: suite.name,
        passed: 0,
        failed: 1,
        details: [{ name: "Suite execution", success: false, error: String(error) }],
      });
    }
  }
  
  // Print comprehensive summary
  console.log("\n" + "=".repeat(70));
  console.log("📊 COMPREHENSIVE TEST RESULTS");
  console.log("=".repeat(70));
  
  allResults.forEach(result => {
    const status = result.failed === 0 ? "✅" : "❌";
    console.log(`${status} ${result.suite}: ${result.passed} passed, ${result.failed} failed`);
    
    if (result.failed > 0) {
      result.details
        .filter(detail => !detail.success)
        .forEach(detail => {
          console.log(`   💥 ${detail.name}: ${detail.error}`);
        });
    }
  });
  
  console.log("-".repeat(70));
  console.log(`🎯 TOTAL: ${totalPassed} passed, ${totalFailed} failed`);
  
  if (totalFailed === 0) {
    console.log("\n🎉 All tests passed! The library is working correctly.");
  } else {
    console.log(`\n⚠️  ${totalFailed} test(s) failed. Please review and fix the issues.`);
  }
  
  console.log("\n✨ Test environments covered:");
  console.log("   • Development environment (NODE_ENV=development)");
  console.log("   • Production environment (NODE_ENV=production)"); 
  console.log("   • Browser environment (no process object)");
  console.log("   • Custom environments (staging, test, etc.)");
  console.log("   • All console method combinations");
  console.log("   • Singleton behavior");
  console.log("   • Error handling and edge cases");
  console.log("   • Real-world integration scenarios");
  
  // Exit with appropriate code
  process.exit(totalFailed > 0 ? 1 : 0);
}

// Run if called directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error("💥 Test runner crashed:", error);
    process.exit(1);
  });
}

export { runAllTests };
