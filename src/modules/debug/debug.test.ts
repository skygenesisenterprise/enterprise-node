import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Logger } from './logger';
import { LogLevel } from './types';
import { Span, Tracer } from './tracer';
import { DebugModule, debug, createDebugLogger, createTracer } from './index';
import { Subscriber } from './types';

describe('Debug Module', () => {
  beforeEach(() => {
    debug.shutdown();
  });

  describe('Logger', () => {
    it('should create logger with default config', () => {
      const logger = new Logger();
      expect(logger.getLevel()).toBe(LogLevel.INFO);
    });

    it('should respect log levels', () => {
      const logger = new Logger({ level: LogLevel.WARN });
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      logger.info('This should not appear');
      logger.warn('This should appear');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      consoleSpy.mockRestore();
    });

    it('should include timestamps when enabled', () => {
      const logger = new Logger({ with_timestamps: true });
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      logger.info('Test message');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test message'));
      consoleSpy.mockRestore();
    });

    it('should handle fields correctly', () => {
      const logger = new Logger();
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      logger.info('Test message', { key: 'value', number: 42 });

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test message'), {
        key: 'value',
        number: 42,
      });
      consoleSpy.mockRestore();
    });

    it('should create logger with span context', () => {
      const logger = new Logger();
      const span = new Span('test-span');
      const spanLogger = logger.withSpan(span.toContext());

      expect(spanLogger).not.toBe(logger);
    });

    it('should create logger with additional fields', () => {
      const logger = new Logger();
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const fieldLogger = logger.withFields({ module: 'test' });
      fieldLogger.info('Test message');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test message'), {
        module: 'test',
      });
      consoleSpy.mockRestore();
    });
  });

  describe('Span', () => {
    it('should create root span', () => {
      const span = Span.createRoot('test-operation');

      expect(span.name).toBe('test-operation');
      expect(span.span_id).toBeDefined();
      expect(span.trace_id).toBeDefined();
      expect(span.parent_span_id).toBeUndefined();
      expect(span.start_time).toBeInstanceOf(Date);
      expect(span.isFinished()).toBe(false);
    });

    it('should create child span', () => {
      const parent = Span.createRoot('parent');
      const child = Span.createChild('child', parent.toContext());

      expect(child.name).toBe('child');
      expect(child.trace_id).toBe(parent.trace_id);
      expect(child.parent_span_id).toBe(parent.span_id);
    });

    it('should calculate duration when ended', () => {
      const span = Span.createRoot('test');

      expect(span.getDuration()).toBeNull();

      span.end();

      expect(span.getDuration()).toBeGreaterThanOrEqual(0);
      expect(span.isFinished()).toBe(true);
    });

    it('should handle metadata', () => {
      const span = Span.createRoot('test', { key: 'value' });

      expect(span.metadata).toEqual({ key: 'value' });

      span.setMetadata({ newKey: 'newValue' });

      expect(span.metadata).toEqual({ key: 'value', newKey: 'newValue' });
    });
  });

  describe('Tracer', () => {
    let tracer: Tracer;
    let mockSubscriber: Subscriber;

    beforeEach(() => {
      tracer = new Tracer();
      mockSubscriber = {
        on_log: vi.fn(),
        on_span_start: vi.fn(),
        on_span_end: vi.fn(),
      };
    });

    it('should start and track spans', () => {
      const span = tracer.startSpan('test-operation');

      expect(span.name).toBe('test-operation');
      expect(tracer.getActiveSpan(span.span_id)).toBe(span);
      expect(tracer.getCurrentSpan()).toBe(span);
    });

    it('should end spans correctly', () => {
      const span = tracer.startSpan('test-operation');

      tracer.endSpan(span.span_id);

      expect(span.isFinished()).toBe(true);
      expect(tracer.getActiveSpan(span.span_id)).toBeUndefined();
    });

    it('should handle parent-child relationships', () => {
      const parent = tracer.startSpan('parent');
      const child = tracer.startSpan('child', parent.toContext());

      expect(child.parent_span_id).toBe(parent.span_id);
      expect(child.trace_id).toBe(parent.trace_id);
    });

    it('should execute functions in span context', () => {
      const result = tracer.inSpan('test-operation', (span: any) => {
        expect(span.name).toBe('test-operation');
        return 'test-result';
      });

      expect(result).toBe('test-result');
      expect(tracer.getCurrentSpan()).toBeUndefined();
    });

    it('should execute async functions in span context', async () => {
      const result = await tracer.inSpanAsync('test-operation', async (span: any) => {
        expect(span.name).toBe('test-operation');
        return 'async-result';
      });

      expect(result).toBe('async-result');
      expect(tracer.getCurrentSpan()).toBeUndefined();
    });

    it('should notify subscribers', () => {
      tracer.subscribe(mockSubscriber);

      const span = tracer.startSpan('test');
      tracer.endSpan(span.span_id);

      expect(mockSubscriber.on_span_start).toHaveBeenCalledWith(span);
      expect(mockSubscriber.on_span_end).toHaveBeenCalledWith(span);
    });
  });

  describe('DebugModule', () => {
    it('should be singleton', () => {
      const instance1 = DebugModule.getInstance();
      const instance2 = DebugModule.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should create and cache loggers', () => {
      const logger1 = debug.getLogger('test');
      const logger2 = debug.getLogger('test');
      const logger3 = debug.getLogger('other');

      expect(logger1).toBe(logger2);
      expect(logger1).not.toBe(logger3);
    });

    it('should instrument functions', () => {
      const result = debug.instrument('test-operation', (span: any) => {
        expect(span.name).toBe('test-operation');
        return 'instrumented-result';
      });

      expect(result).toBe('instrumented-result');
    });

    it('should instrument async functions', async () => {
      const result = await debug.instrumentAsync('test-operation', async (span: any) => {
        expect(span.name).toBe('test-operation');
        return 'async-instrumented-result';
      });

      expect(result).toBe('async-instrumented-result');
    });

    it('should handle errors in instrumented functions', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      expect(() => {
        debug.instrument('test-operation', () => {
          throw new Error('Test error');
        });
      }).toThrow('Test error');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error in test-operation'),
        expect.objectContaining({
          error: 'Test error',
        })
      );

      consoleSpy.mockRestore();
    });

    it('should set global log levels', () => {
      const logger1 = debug.getLogger('test1');
      const logger2 = debug.getLogger('test2');

      debug.setGlobalLevel(LogLevel.ERROR);

      expect(logger1.getLevel()).toBe(LogLevel.ERROR);
      expect(logger2.getLevel()).toBe(LogLevel.ERROR);
    });
  });

  describe('Convenience Functions', () => {
    it('should create debug logger', () => {
      const logger = createDebugLogger('test-target');

      expect(logger).toBeInstanceOf(Logger);
    });

    it('should create tracer', () => {
      const tracer = createTracer();

      expect(tracer).toBeInstanceOf(Tracer);
    });
  });
});
