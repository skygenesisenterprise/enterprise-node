import { Logger } from './logger';
import { Tracer, Span } from './tracer';
import { Subscriber } from './types';
import { LogLevel } from './types';

export class DebugModule {
  private static instance: DebugModule;
  private tracer: Tracer;
  private loggers: Map<string, Logger> = new Map();
  private globalSubscribers: Subscriber[] = [];

  private constructor() {
    this.tracer = new Tracer();
  }

  static getInstance(): DebugModule {
    if (!DebugModule.instance) {
      DebugModule.instance = new DebugModule();
    }
    return DebugModule.instance;
  }

  getLogger(target: string = 'default'): Logger {
    if (!this.loggers.has(target)) {
      const logger = new Logger({ target });
      this.globalSubscribers.forEach((subscriber) => logger.subscribe(subscriber));
      this.loggers.set(target, logger);
    }
    return this.loggers.get(target)!;
  }

  getTracer(): Tracer {
    return this.tracer;
  }

  subscribe(subscriber: Subscriber): void {
    this.globalSubscribers.push(subscriber);
    this.tracer.subscribe(subscriber);
    this.loggers.forEach((logger) => logger.subscribe(subscriber));
  }

  unsubscribe(subscriber: Subscriber): void {
    const index = this.globalSubscribers.indexOf(subscriber);
    if (index > -1) {
      this.globalSubscribers.splice(index, 1);
    }
    this.tracer.unsubscribe(subscriber);
    this.loggers.forEach((logger) => logger.unsubscribe(subscriber));
  }

  setGlobalLevel(level: LogLevel): void {
    this.loggers.forEach((logger) => logger.setLevel(level));
  }

  enableDebugMode(): void {
    this.setGlobalLevel(LogLevel.DEBUG);
  }

  enableTraceMode(): void {
    this.setGlobalLevel(LogLevel.TRACE);
  }

  disableDebugMode(): void {
    this.setGlobalLevel(LogLevel.INFO);
  }

  instrument<T>(
    name: string,
    fn: (span: Span) => T,
    target: string = 'default',
    metadata?: Record<string, any>
  ): T {
    const logger = this.getLogger(target);
    const span = this.tracer.startSpan(name, this.tracer.getCurrentSpan(), metadata);
    const spanLogger = logger.withSpan(span.toContext());

    spanLogger.debug(`Starting ${name}`, metadata);

    try {
      const result = fn(span);
      spanLogger.debug(`Completed ${name}`, { duration: span.getDuration() });
      return result;
    } catch (error) {
      spanLogger.error(`Error in ${name}`, {
        error: error instanceof Error ? error.message : String(error),
        duration: span.getDuration(),
      });
      throw error;
    } finally {
      span.end();
    }
  }

  async instrumentAsync<T>(
    name: string,
    fn: (span: Span) => Promise<T>,
    target: string = 'default',
    metadata?: Record<string, any>
  ): Promise<T> {
    const logger = this.getLogger(target);
    const span = this.tracer.startSpan(name, this.tracer.getCurrentSpan(), metadata);
    const spanLogger = logger.withSpan(span.toContext());

    spanLogger.debug(`Starting ${name}`, metadata);

    try {
      const result = await fn(span);
      spanLogger.debug(`Completed ${name}`, { duration: span.getDuration() });
      return result;
    } catch (error) {
      spanLogger.error(`Error in ${name}`, {
        error: error instanceof Error ? error.message : String(error),
        duration: span.getDuration(),
      });
      throw error;
    } finally {
      span.end();
    }
  }

  shutdown(): void {
    this.tracer.finishAll();
  }
}

export const debug = DebugModule.getInstance();

export function createDebugLogger(target: string): Logger {
  return debug.getLogger(target);
}

export function createTracer(): Tracer {
  return debug.getTracer();
}

export function instrument<T>(
  name: string,
  fn: (span: Span) => T,
  target?: string,
  metadata?: Record<string, any>
): T {
  return debug.instrument(name, fn, target, metadata);
}

export async function instrumentAsync<T>(
  name: string,
  fn: (span: Span) => Promise<T>,
  target?: string,
  metadata?: Record<string, any>
): Promise<T> {
  return debug.instrumentAsync(name, fn, target, metadata);
}

export const trace = (target: string = 'default') =>
  debug.getLogger(target).trace.bind(debug.getLogger(target));
export const debug_log = (target: string = 'default') =>
  debug.getLogger(target).debug.bind(debug.getLogger(target));
export const info = (target: string = 'default') =>
  debug.getLogger(target).info.bind(debug.getLogger(target));
export const warn = (target: string = 'default') =>
  debug.getLogger(target).warn.bind(debug.getLogger(target));
export const error = (target: string = 'default') =>
  debug.getLogger(target).error.bind(debug.getLogger(target));
