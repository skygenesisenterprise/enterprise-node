#!/usr/bin/env node

/**
 * Demo script showcasing the Enterprise SDK with Debug System and Plugin System
 */

const { createEnterprise } = require('./packages/core/dist/index.js');

async function debugSystemDemo() {
  console.log('🔍 Debug System Demo');
  console.log('==================');

  // Initialize SDK with debug enabled
  const enterprise = await createEnterprise({
    modules: {
      debug: {
        level: 'debug',
        enableTracing: true,
        enableConsole: true,
      },
      ai: true,
      storage: true,
    },
  });

  // Create a span for the entire operation
  const mainSpan = enterprise.debug.createSpan('debug-demo', {
    demo: 'debug-system',
    timestamp: new Date().toISOString(),
  });

  try {
    // Test different log levels
    enterprise.debug.trace('Trace message - detailed debugging info');
    enterprise.debug.debug('Debug message - development info');
    enterprise.debug.info('Info message - general information');
    enterprise.debug.warn('Warning message - potential issue');
    enterprise.debug.error('Error message - something went wrong');

    // Test structured logging
    enterprise.debug.info('User operation', {
      userId: 'user-123',
      action: 'login',
      timestamp: new Date().toISOString(),
      ip: '192.168.1.1',
    });

    // Test nested spans
    const aiSpan = enterprise.debug.createSpan('ai-operation', {
      operation: 'text-generation',
      model: 'demo-model',
    });

    try {
      enterprise.debug.info('Starting AI generation');

      // Simulate AI operation
      await new Promise((resolve) => setTimeout(resolve, 100));

      enterprise.debug.info('AI generation completed', {
        tokens: 42,
        duration: aiSpan.duration,
      });
    } finally {
      aiSpan.end();
    }

    // Get and display metrics
    const metrics = enterprise.debug.getMetrics();
    console.log('\n📊 Debug Metrics:');
    console.log('================');
    console.log(`Total logs: ${metrics.totalLogs}`);
    console.log(`Logs by level:`, metrics.logsByLevel);
    console.log(`Active spans: ${metrics.activeSpans}`);
    console.log(`Total spans: ${metrics.totalSpans}`);
    console.log(`Memory usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)} MB`);
  } finally {
    mainSpan.end();
    console.log(`\n⏱️ Main operation completed in ${mainSpan.duration}ms`);
  }
}

async function pluginSystemDemo() {
  console.log('\n\n🔌 Plugin System Demo');
  console.log('====================');

  // Initialize SDK with plugins
  const enterprise = await createEnterprise({
    modules: {
      debug: true,
      ai: true,
    },
    plugins: {
      enabled: ['demo-plugin'],
      config: {
        'demo-plugin': {
          version: '1.0.0',
          enabled: true,
        },
      },
    },
  });

  // Create a demo plugin
  const demoPlugin = {
    name: 'demo-plugin',
    version: '1.0.0',

    async initialize(context) {
      context.debug.info('Initializing demo plugin');

      // Simulate plugin initialization
      await new Promise((resolve) => setTimeout(resolve, 50));

      context.debug.info('Demo plugin initialized successfully');
    },

    async execute(input) {
      const span = context.debug.createSpan('plugin-execute', {
        plugin: this.name,
        inputType: typeof input,
      });

      try {
        context.debug.debug('Executing plugin logic', { input });

        // Simulate plugin work
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

    async destroy() {
      console.log('🔌 Demo plugin destroyed');
    },
  };

  try {
    // Register the plugin
    console.log('📝 Registering demo plugin...');
    await enterprise.plugins.register(demoPlugin);

    // Execute the plugin
    console.log('⚡ Executing demo plugin...');
    const result = await enterprise.plugins.execute('demo-plugin', {
      message: 'Hello from plugin system!',
      data: { test: true },
    });

    console.log('✅ Plugin result:', result);

    // Get plugin metrics
    const metrics = enterprise.plugins.getMetrics();
    console.log('\n📈 Plugin Metrics:');
    console.log('==================');
    console.log(`Total plugins: ${metrics.totalPlugins}`);
    console.log(`Loaded plugins: ${metrics.loadedPlugins}`);
    console.log(`Failed plugins: ${metrics.failedPlugins}`);
    console.log('Plugin details:', metrics.pluginMetrics);
  } finally {
    // Cleanup
    await enterprise.plugins.destroyAll();
  }
}

async function frameworkIntegrationDemo() {
  console.log('\n\n🎨 Framework Integration Demo');
  console.log('===============================');

  // Simulate React integration
  console.log('⚛️ React Integration:');
  const reactDemo = {
    useDebug: () => enterprise.debug,
    useAI: () => enterprise.ai,

    async componentDemo() {
      const debug = this.useDebug();
      const ai = this.useAI();

      const span = debug.createSpan('react-component');

      try {
        debug.info('React component mounted');

        // Simulate component logic
        const response = await ai.generate('Hello from React component!');

        debug.info('AI response received', {
          length: response.length,
          component: 'DemoComponent',
        });

        return response;
      } finally {
        span.end();
      }
    },
  };

  // Simulate Next.js integration
  console.log('▲ Next.js Integration:');
  const nextjsDemo = {
    async apiRoute() {
      const span = enterprise.debug.createSpan('nextjs-api-route', {
        route: '/api/demo',
        method: 'POST',
      });

      try {
        enterprise.debug.info('API route called', {
          path: '/api/demo',
          method: 'POST',
          ip: '127.0.0.1',
        });

        // Simulate API logic
        await new Promise((resolve) => setTimeout(resolve, 20));

        enterprise.debug.info('API route completed successfully');

        return { status: 'success', data: 'Hello from Next.js API!' };
      } catch (error) {
        enterprise.debug.error('API route failed', { error: error.message });
        throw error;
      } finally {
        span.end();
      }
    },
  };

  // Execute framework demos
  console.log('🔄 Running React component demo...');
  const reactResult = await reactDemo.componentDemo();
  console.log('React result:', reactResult.substring(0, 50) + '...');

  console.log('🌐 Running Next.js API route demo...');
  const apiResult = await nextjsDemo.apiRoute();
  console.log('API result:', apiResult);
}

async function performanceMonitoringDemo() {
  console.log('\n\n📊 Performance Monitoring Demo');
  console.log('===============================');

  const enterprise = await createEnterprise({
    modules: {
      debug: {
        level: 'info',
        enableTracing: true,
      },
    },
  });

  // Simulate multiple operations
  const operations = [];

  for (let i = 0; i < 10; i++) {
    const span = enterprise.debug.createSpan('operation-' + i, {
      iteration: i,
      type: 'performance-test',
    });

    operations.push(
      new Promise((resolve) => {
        setTimeout(() => {
          enterprise.debug.info(`Operation ${i} completed`);
          span.end();
          resolve(i);
        }, Math.random() * 100);
      })
    );
  }

  // Wait for all operations
  await Promise.all(operations);

  // Get final metrics
  const metrics = enterprise.debug.getMetrics();
  console.log('\n📈 Performance Summary:');
  console.log('=======================');
  console.log(`Total operations: ${metrics.totalSpans}`);
  console.log(`Average duration: ${metrics.averageSpanDuration.toFixed(2)}ms`);
  console.log(`Memory usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Active spans: ${metrics.activeSpans}`);

  // Show recent logs
  const logs = enterprise.debug.getLogs().slice(-5);
  console.log('\n📝 Recent Logs:');
  console.log('================');
  logs.forEach((log) => {
    console.log(`[${log.level.toUpperCase()}] ${log.message}`);
  });
}

// Main execution
async function main() {
  console.log('🚀 Enterprise SDK Debug & Plugin System Demo');
  console.log('============================================\n');

  try {
    await debugSystemDemo();
    await pluginSystemDemo();
    await frameworkIntegrationDemo();
    await performanceMonitoringDemo();

    console.log('\n\n✅ Demo completed successfully!');
    console.log('🎉 The Enterprise SDK debug and plugin systems are working perfectly!');
  } catch (error) {
    console.error('\n❌ Demo failed:', error);
    process.exit(1);
  }
}

// Run the demo
if (require.main === module) {
  main();
}

module.exports = {
  debugSystemDemo,
  pluginSystemDemo,
  frameworkIntegrationDemo,
  performanceMonitoringDemo,
};
