/**
 * Debug System Test - ES Module version
 */

import { createEnterprise } from './packages/core/dist/index.esm.js';

async function testDebugSystem() {
  console.log('🔍 Testing Debug System');
  console.log('========================\n');

  try {
    // Initialize SDK with debug module
    const enterprise = await createEnterprise({
      modules: {
        debug: {
          level: 'debug',
          enableTracing: true,
          enableConsole: true,
        },
        ai: true,
      },
    });

    console.log('✅ Enterprise SDK initialized successfully');
    console.log('📦 Available modules:', Object.keys(enterprise));

    // Test debug functionality
    const mainSpan = enterprise.debug.createSpan('debug-test', {
      test: 'debug-system',
      timestamp: new Date().toISOString(),
    });

    console.log('\n📝 Testing log levels:');
    enterprise.debug.trace('Trace message - detailed info');
    enterprise.debug.debug('Debug message - development info');
    enterprise.debug.info('Info message - general information');
    enterprise.debug.warn('Warning message - potential issue');
    enterprise.debug.error('Error message - test error');

    // Test structured logging
    console.log('\n📊 Testing structured logging:');
    enterprise.debug.info('User action', {
      userId: 'test-user-123',
      action: 'debug-test',
      timestamp: new Date().toISOString(),
      metadata: { test: true, version: '1.0.0' },
    });

    // Test nested spans
    console.log('\n🔗 Testing nested spans:');
    const nestedSpan = enterprise.debug.createSpan('nested-operation', {
      parent: 'debug-test',
      operation: 'test-nested',
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    enterprise.debug.info('Nested operation completed');
    nestedSpan.end();

    // Get metrics
    const metrics = enterprise.debug.getMetrics();
    console.log('\n📈 Debug Metrics:');
    console.log('==================');
    console.log(`Total logs: ${metrics.totalLogs}`);
    console.log(`Logs by level:`, metrics.logsByLevel);
    console.log(`Active spans: ${metrics.activeSpans}`);
    console.log(`Total spans: ${metrics.totalSpans}`);
    console.log(`Average span duration: ${metrics.averageSpanDuration.toFixed(2)}ms`);
    console.log(`Memory usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)} MB`);

    // End main span
    mainSpan.end();
    console.log(`\n⏱️ Main operation completed in ${mainSpan.duration}ms`);

    // Test plugin system
    console.log('\n\n🔌 Testing Plugin System');
    console.log('==========================\n');

    const testPlugin = {
      name: 'test-plugin',
      version: '1.0.0',

      async initialize(context) {
        context.debug.info('Initializing test plugin');
        await new Promise((resolve) => setTimeout(resolve, 20));
        context.debug.info('Test plugin initialized');
      },

      async execute(input) {
        const span = context.debug.createSpan('plugin-execute', {
          plugin: this.name,
          input: typeof input,
        });

        try {
          context.debug.debug('Executing plugin', { input });
          await new Promise((resolve) => setTimeout(resolve, 30));

          const result = {
            processed: true,
            data: input,
            timestamp: new Date().toISOString(),
            plugin: this.name,
          };

          context.debug.info('Plugin execution completed', { result });
          return result;
        } finally {
          span.end();
        }
      },
    };

    // Register and test plugin
    await enterprise.plugins.register(testPlugin);
    console.log('✅ Plugin registered successfully');

    const pluginResult = await enterprise.plugins.execute('test-plugin', {
      message: 'Hello from plugin system!',
      test: true,
    });

    console.log('🎯 Plugin result:', pluginResult);

    // Get plugin metrics
    const pluginMetrics = enterprise.plugins.getMetrics();
    console.log('\n📊 Plugin Metrics:');
    console.log('==================');
    console.log(`Total plugins: ${pluginMetrics.totalPlugins}`);
    console.log(`Loaded plugins: ${pluginMetrics.loadedPlugins}`);
    console.log(`Failed plugins: ${pluginMetrics.failedPlugins}`);

    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ Debug system and plugin system are working perfectly!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run the test
testDebugSystem();
