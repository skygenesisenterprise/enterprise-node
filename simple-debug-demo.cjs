/**
 * Simple Debug System Demo
 */

const { createEnterprise } = require('./packages/core/dist/index.js');

async function demo() {
  console.log('🚀 Enterprise SDK Debug System Demo');
  console.log('====================================\n');

  try {
    // Initialize SDK with debug
    const enterprise = await createEnterprise({
      modules: {
        debug: {
          level: 'debug',
          enableTracing: true,
          enableConsole: true,
        },
      },
    });

    console.log('✅ Enterprise SDK initialized with debug module');

    // Test debug functionality
    const span = enterprise.debug.createSpan('demo-operation');

    enterprise.debug.info('Hello from debug system!');
    enterprise.debug.debug('Debug message with data', { test: true });
    enterprise.debug.warn('Warning message');

    // Simulate some work
    await new Promise((resolve) => setTimeout(resolve, 100));

    span.end();

    // Get metrics
    const metrics = enterprise.debug.getMetrics();
    console.log('\n📊 Debug Metrics:');
    console.log(`Total logs: ${metrics.totalLogs}`);
    console.log(`Total spans: ${metrics.totalSpans}`);
    console.log(`Duration: ${span.duration}ms`);

    console.log('\n🎉 Debug system demo completed successfully!');
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.error(error.stack);
  }
}

demo();
