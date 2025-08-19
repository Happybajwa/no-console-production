// React Components Test (Node.js simulation)
// This tests the React hook and provider without requiring full React setup

const React = require('react');

// Mock React hooks for testing
let effectCleanups = [];
const originalUseEffect = React.useEffect;
const originalUseRef = React.useRef;

React.useEffect = (callback, deps) => {
  console.log(`📝 useEffect called with deps: ${JSON.stringify(deps)}`);
  const cleanup = callback();
  if (typeof cleanup === 'function') {
    effectCleanups.push(cleanup);
    console.log('📝 Cleanup function registered');
  }
};

React.useRef = (initialValue) => ({ current: initialValue });

// Test the hook
try {
  console.log('🧪 Testing React Hook Integration\n');
  
  const { useConsoleSuppression } = require('./dist/hooks/useConsoleSuppression.js');
  
  console.log('✅ Hook imported successfully');
  
  // Simulate hook usage
  console.log('\n📝 Simulating useConsoleSuppression call:');
  useConsoleSuppression({
    methods: ['log'],
    enabled: true,
    preserveErrors: true
  });
  
  console.log('✅ Hook executed without errors');
  
  // Test cleanup
  console.log('\n📝 Testing cleanup functions:');
  effectCleanups.forEach((cleanup, index) => {
    console.log(`Calling cleanup function ${index + 1}`);
    cleanup();
  });
  
  console.log('✅ Cleanup functions executed successfully');
  
} catch (error) {
  console.error('❌ React hook test failed:', error.message);
}

// Restore React hooks
React.useEffect = originalUseEffect;
React.useRef = originalUseRef;

console.log('\n🎉 React integration test completed!');
