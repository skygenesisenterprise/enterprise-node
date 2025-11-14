# Debug Module

The Debug module provides a comprehensive debugging and logging system inspired by Rust's tracing and logging ecosystem. It offers structured logging, distributed tracing, and powerful debugging tools for enterprise applications.

## Features

- **Structured Logging**: Multi-level logging with structured data support
- **Distributed Tracing**: Span-based tracing with parent-child relationships
- **Rust-Inspired Design**: Familiar concepts from Rust's tracing ecosystem
- **Performance Monitoring**: Built-in timing and performance metrics
- **Flexible Output**: Console, file, or custom output destinations
- **Macros System**: Convenient logging macros for different modules
- **Type Safety**: Full TypeScript support with strict typing
- **Zero Overhead**: Optimized for production use with conditional compilation

## Configuration

### Basic Setup

```typescript
import { debug, LogLevel } from '@skygenesisenterprise/debug';

// Enable debug mode
debug.enableDebugMode();

// Set global log level
debug.setGlobalLevel(LogLevel.DEBUG);

// Enable trace mode for detailed debugging
debug.enableTraceMode();
```

### Advanced Configuration

```typescript
import { createDebugLogger, LogLevel } from '@skygenesisenterprise/debug';

const logger = createDebugLogger('my-module', {
  level: LogLevel.INFO,
  with_timestamps: true,
  with_colors: true,
  output: 'console',
  custom_output: (record) => {
    // Custom logging logic
    sendToExternalService(record);
  },
});
```

## Log Levels

The debug module supports five log levels, following the Rust tracing convention:

- **TRACE** (0): Most detailed information, typically only of interest when diagnosing problems
- **DEBUG** (1): Detailed information on the flow through the system
- **INFO** (2): Interesting runtime events (startup/shutdown)
- **WARN** (3): Use of deprecated APIs, poor use of API, 'almost' errors, other runtime situations that are undesirable or unexpected
- **ERROR** (4): Serious runtime errors that should be investigated

### Log Level Filtering

```typescript
import { LogLevel } from '@skygenesisenterprise/debug';

// Set different levels for different environments
if (process.env.NODE_ENV === 'development') {
  debug.setGlobalLevel(LogLevel.TRACE);
} else if (process.env.NODE_ENV === 'staging') {
  debug.setGlobalLevel(LogLevel.DEBUG);
} else {
  debug.setGlobalLevel(LogLevel.INFO);
}
```

## Structured Logging

### Basic Logging

```typescript
import { createDebugLogger } from '@skygenesisenterprise/debug';

const logger = createDebugLogger('user-service');

// Simple log messages
logger.info('User logged in successfully');
logger.error('Database connection failed');

// Structured logging with fields
logger.info('User action completed', {
  userId: '12345',
  action: 'purchase',
  duration: 150,
  success: true,
});

logger.error('API request failed', {
  endpoint: '/api/users',
  method: 'POST',
  statusCode: 500,
  error: 'Internal server error',
  requestId: 'req_abc123',
});
```

### Field Enrichment

```typescript
// Create logger with default fields
const userLogger = logger.withFields({
  service: 'user-service',
  version: '1.2.0',
  environment: process.env.NODE_ENV,
});

// All logs will include the default fields
userLogger.info('Processing user request', { userId: '123' });
// Output: { service: 'user-service', version: '1.2.0', environment: 'production', userId: '123' }
```

### Target-Specific Logging

```typescript
// Create loggers for different components
const authLogger = createDebugLogger('auth');
const dbLogger = createDebugLogger('database');
const apiLogger = createDebugLogger('api');

authLogger.info('User authenticated', { userId: '123' });
dbLogger.debug('Query executed', { query: 'SELECT * FROM users', duration: 45 });
apiLogger.warn('Rate limit approaching', { current: 95, limit: 100 });
```

## Distributed Tracing

### Span Management

```typescript
import { createTracer } from '@skygenesisenterprise/debug';

const tracer = createTracer();

// Create a root span
const rootSpan = tracer.startSpan('user-registration', undefined, {
  userId: '12345',
  email: 'user@example.com',
});

try {
  // Create child spans
  const validationSpan = tracer.startSpan('validate-input', rootSpan.toContext());
  // ... validation logic
  validationSpan.end();

  const dbSpan = tracer.startSpan('save-to-database', rootSpan.toContext());
  // ... database operations
  dbSpan.end();
} finally {
  rootSpan.end();
}
```

### Automatic Span Management

```typescript
// Use instrument() for automatic span lifecycle management
import { debug } from '@skygenesisenterprise/debug';

const result = debug.instrument(
  'user-registration',
  (span) => {
    span.setMetadata({ userId: '12345' });

    // Validation
    debug.instrument('validate-input', (validationSpan) => {
      // Validation logic
      return { valid: true };
    });

    // Database operation
    debug.instrument('save-to-database', (dbSpan) => {
      // Database logic
      return { saved: true };
    });

    return { success: true, userId: '12345' };
  },
  'user-service'
);

// Spans are automatically created and ended
```

### Async Operations

```typescript
// Async span management
const user = await debug.instrumentAsync(
  'fetch-user',
  async (span) => {
    span.setMetadata({ userId: '12345' });

    const dbUser = await debug.instrumentAsync('database-query', async (dbSpan) => {
      dbSpan.setMetadata({ query: 'SELECT * FROM users WHERE id = ?' });
      return await database.findById('12345');
    });

    const permissions = await debug.instrumentAsync('fetch-permissions', async (permSpan) => {
      permSpan.setMetadata({ userId: dbUser.id });
      return await permissionService.getByUserId(dbUser.id);
    });

    return { ...dbUser, permissions };
  },
  'user-service'
);
```

## Logging Macros

The debug module provides convenient macros for different modules, inspired by Rust's macro system:

### Predefined Macros

```typescript
import {
  log,
  runtime_log,
  wasm_log,
  ai_log,
  storage_log,
  auth_log,
  ui_log,
  project_log,
} from '@skygenesisenterprise/debug';

// General enterprise logging
log.info('Application started', { version: '1.0.0' });
log.error('Critical error occurred', { error: 'Database connection failed' });

// Module-specific logging
runtime_log.debug('WASM module loaded', { size: 1024 });
wasm_log.trace('Function called', { function: 'ai_enhance', args: 2 });
ai_log.info('Text generated', { tokens: 150, model: 'gpt-3.5-turbo' });
storage_log.warn('Storage quota exceeded', { used: '95%', limit: '100%' });
auth_log.info('User authenticated', { userId: '123', method: 'jwt' });
ui_log.debug('Component rendered', { component: 'Button', props: 3 });
project_log.info('Build completed', { duration: '2.5s', success: true });
```

### Custom Macros

```typescript
import { create_macros } from '@skygenesisenterprise/debug';

// Create custom macros for your modules
const paymentLog = create_macros('payment-service');
const notificationLog = create_macros('notification-service');

paymentLog.info('Payment processed', { amount: 99.99, currency: 'USD' });
paymentLog.error('Payment failed', { error: 'Card declined', amount: 99.99 });

notificationLog.debug('Email sent', { to: 'user@example.com', template: 'welcome' });
notificationLog.warn('Rate limit exceeded', { current: 101, limit: 100 });
```

### Span Macros

```typescript
import { log } from '@skygenesisenterprise/debug';

// Synchronous span with macro
const result = log.span(
  'data-processing',
  () => {
    // Processing logic
    return { processed: 1000, errors: 0 };
  },
  'data-service',
  { batchSize: 1000 }
);

// Asynchronous span with macro
const users = await log.asyncSpan(
  'fetch-users',
  async () => {
    return await userRepository.findAll();
  },
  'user-service',
  { limit: 100 }
);
```

## Framework Integration

### Plugin System Integration

The debug module integrates seamlessly with the Enterprise SDK plugin system:

```typescript
import { createEnterpriseApp } from '@skygenesisenterprise/enterprise-node';

const app = createEnterpriseApp({
  modules: {
    debug: true, // Enable debug module
    ai: true,
    storage: true,
  },
  debug: {
    level: 'debug', // Global debug level
    tracing: true, // Enable distributed tracing
    output: 'console',
  },
});

// Debug is now available throughout the application
app.debug.info('Application initialized');
```

### Framework-Specific Configuration

#### Next.js Integration

```typescript
// next.config.js
const { withEnterprise } = require('@skygenesisenterprise/nextjs');

module.exports = withEnterprise({
  debug: {
    level: process.env.NODE_ENV === 'development' ? 'trace' : 'info',
    tracing: true,
    spans: {
      'api-route': true,
      'page-render': true,
      'data-fetch': true,
    },
  },
});
```

#### React Integration

```typescript
import { useDebug } from '@skygenesisenterprise/react';

function MyComponent() {
  const debug = useDebug('my-component');

  useEffect(() => {
    debug.trace('Component mounted', { props });

    return () => {
      debug.trace('Component unmounted');
    };
  }, []);

  const handleClick = () => {
    debug.span('button-click', () => {
      // Handle click
      analytics.track('button_clicked');
    }, { buttonId: 'submit' });
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

## Performance Monitoring

### Built-in Metrics

```typescript
import { debug } from '@skygenesisenterprise/debug';

// Automatic performance tracking
const result = debug.instrument('expensive-operation', (span) => {
  // The span automatically tracks duration
  return performExpensiveOperation();
});

// Manual performance tracking
const span = tracer.startSpan('manual-timing');
const startTime = performance.now();

// ... operation

span.end();
const duration = span.getDuration();
debug.info('Operation completed', { duration, operation: 'manual-timing' });
```

### Performance Subscribers

```typescript
import { debug } from '@skygenesisenterprise/debug';

// Create a performance monitoring subscriber
const performanceSubscriber = {
  on_log: (record) => {
    if (record.fields?.duration && record.fields.duration > 1000) {
      // Alert on slow operations
      alerting.sendAlert('Slow operation detected', {
        operation: record.span?.name,
        duration: record.fields.duration,
        threshold: 1000,
      });
    }
  },
  on_span_start: (span) => {
    // Track span start
    metrics.increment('spans.started', { operation: span.name });
  },
  on_span_end: (span) => {
    // Track span completion
    const duration = span.getDuration();
    metrics.histogram('span.duration', duration, { operation: span.name });
    metrics.increment('spans.completed', { operation: span.name });
  },
};

debug.subscribe(performanceSubscriber);
```

## Error Handling and Debugging

### Error Context

```typescript
import { debug, DebugError } from '@skygenesisenterprise/debug';

try {
  await riskyOperation();
} catch (error) {
  // Create structured error with context
  const debugError = new DebugError('Operation failed', 'OPERATION_FAILURE', {
    userId: '123',
    operation: 'data-processing',
    timestamp: new Date().toISOString(),
    originalError: error.message,
  });

  debug.error('Operation failed', {
    error: debugError,
    context: debugError.context,
  });

  throw debugError;
}
```

### Debug Mode Features

```typescript
// Enable comprehensive debugging
debug.enableDebugMode();

// Debug mode provides additional information
debug.trace('Detailed trace information', {
  stackTrace: new Error().stack,
  memoryUsage: process.memoryUsage(),
  activeHandles: process._getActiveHandles().length,
  activeRequests: process._getActiveRequests().length,
});
```

## Production Considerations

### Environment-Specific Configuration

```typescript
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const debugConfig = {
  level: isDevelopment ? LogLevel.TRACE : LogLevel.INFO,
  with_timestamps: true,
  with_colors: isDevelopment,
  output: isProduction ? 'custom' : 'console',
  custom_output: isProduction
    ? (record) => {
        // Send to logging service in production
        loggingService.send(record);
      }
    : undefined,
};

debug.setGlobalLevel(debugConfig.level);
```

### Performance Optimization

```typescript
// Conditional logging for expensive operations
const expensiveData = debug.getLevel() <= LogLevel.DEBUG ? generateExpensiveDebugData() : null;

debug.debug('Expensive operation data', { data: expensiveData });

// Lazy evaluation
debug.debug('Lazy evaluation', () => ({
  expensiveData: generateExpensiveDebugData(),
  timestamp: Date.now(),
}));
```

## Best Practices

### 1. Structured Logging

```typescript
// Good: Structured with context
logger.info('User action completed', {
  userId: user.id,
  action: 'purchase',
  amount: 99.99,
  currency: 'USD',
  duration: 150,
});

// Avoid: Unstructured strings
logger.info(`User ${user.id} completed purchase of $99.99 USD in 150ms`);
```

### 2. Appropriate Log Levels

```typescript
// TRACE: Detailed execution flow
logger.trace('Function entered', { function: 'processPayment', args: { amount: 99.99 } });

// DEBUG: Detailed diagnostic information
logger.debug('Payment processing', { step: 'validation', cardType: 'visa' });

// INFO: Important business events
logger.info('Payment processed', { userId: '123', amount: 99.99, success: true });

// WARN: Deprecated usage or potential issues
logger.warn('Using deprecated API', { endpoint: '/old-api', alternative: '/new-api' });

// ERROR: Actual errors that need attention
logger.error('Payment failed', { error: 'Card declined', userId: '123', amount: 99.99 });
```

### 3. Span Naming

```typescript
// Good: Descriptive and consistent
debug.instrument('user-registration.validate-email', () => validateEmail(email));
debug.instrument('payment.process-credit-card', () => processPayment(card));

// Avoid: Vague or inconsistent names
debug.instrument('do-stuff', () => validateEmail(email));
debug.instrument('handle-it', () => processPayment(card));
```

### 4. Error Context

```typescript
// Good: Rich error context
try {
  await processPayment(paymentData);
} catch (error) {
  logger.error('Payment processing failed', {
    error: error.message,
    userId: paymentData.userId,
    amount: paymentData.amount,
    paymentMethod: paymentData.method,
    timestamp: new Date().toISOString(),
    requestId: context.requestId,
    spanId: span.span_id,
  });
}
```

### 5. Performance Considerations

```typescript
// Good: Conditional expensive operations
if (logger.getLevel() <= LogLevel.DEBUG) {
  const expensiveData = await collectDebugMetrics();
  logger.debug('Performance metrics', { metrics: expensiveData });
}

// Good: Lazy evaluation
logger.debug('Expensive data', () => ({
  metrics: collectDebugMetrics(),
  timestamp: Date.now(),
}));
```

## Troubleshooting

### Common Issues

1. **Logs not appearing**: Check log level configuration
2. **Missing span context**: Ensure proper span lifecycle management
3. **Performance impact**: Use appropriate log levels and conditional logging
4. **Memory usage**: Regularly clean up old spans and subscribers

### Debug Information

```typescript
// Get current debug state
const currentLevel = debug.getLevel();
const activeSpans = debug.getTracer().getActiveSpans();
const currentSpan = debug.getTracer().getCurrentSpan();

// Debug the debug system
debug.info('Debug system state', {
  level: currentLevel,
  activeSpans: activeSpans.length,
  currentSpan: currentSpan?.name,
  subscribers: debug.getSubscribers().length,
});
```

The Debug module provides enterprise-grade debugging capabilities while maintaining performance and flexibility. Use it to gain deep insights into your application's behavior and quickly identify and resolve issues.
