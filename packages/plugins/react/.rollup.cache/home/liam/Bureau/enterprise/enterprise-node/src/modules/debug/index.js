import { Logger } from './logger';
import { Tracer } from './tracer';
import { LogLevel } from './types';
export class DebugModule {
    constructor() {
        this.loggers = new Map();
        this.globalSubscribers = [];
        this.tracer = new Tracer();
    }
    static getInstance() {
        if (!DebugModule.instance) {
            DebugModule.instance = new DebugModule();
        }
        return DebugModule.instance;
    }
    getLogger(target = 'default') {
        if (!this.loggers.has(target)) {
            const logger = new Logger({ target });
            this.globalSubscribers.forEach((subscriber) => logger.subscribe(subscriber));
            this.loggers.set(target, logger);
        }
        return this.loggers.get(target);
    }
    getTracer() {
        return this.tracer;
    }
    subscribe(subscriber) {
        this.globalSubscribers.push(subscriber);
        this.tracer.subscribe(subscriber);
        this.loggers.forEach((logger) => logger.subscribe(subscriber));
    }
    unsubscribe(subscriber) {
        const index = this.globalSubscribers.indexOf(subscriber);
        if (index > -1) {
            this.globalSubscribers.splice(index, 1);
        }
        this.tracer.unsubscribe(subscriber);
        this.loggers.forEach((logger) => logger.unsubscribe(subscriber));
    }
    setGlobalLevel(level) {
        this.loggers.forEach((logger) => logger.setLevel(level));
    }
    enableDebugMode() {
        this.setGlobalLevel(LogLevel.DEBUG);
    }
    enableTraceMode() {
        this.setGlobalLevel(LogLevel.TRACE);
    }
    disableDebugMode() {
        this.setGlobalLevel(LogLevel.INFO);
    }
    instrument(name, fn, target = 'default', metadata) {
        const logger = this.getLogger(target);
        const span = this.tracer.startSpan(name, this.tracer.getCurrentSpan(), metadata);
        const spanLogger = logger.withSpan(span.toContext());
        spanLogger.debug(`Starting ${name}`, metadata);
        try {
            const result = fn(span);
            spanLogger.debug(`Completed ${name}`, { duration: span.getDuration() });
            return result;
        }
        catch (error) {
            spanLogger.error(`Error in ${name}`, {
                error: error instanceof Error ? error.message : String(error),
                duration: span.getDuration(),
            });
            throw error;
        }
        finally {
            span.end();
        }
    }
    async instrumentAsync(name, fn, target = 'default', metadata) {
        const logger = this.getLogger(target);
        const span = this.tracer.startSpan(name, this.tracer.getCurrentSpan(), metadata);
        const spanLogger = logger.withSpan(span.toContext());
        spanLogger.debug(`Starting ${name}`, metadata);
        try {
            const result = await fn(span);
            spanLogger.debug(`Completed ${name}`, { duration: span.getDuration() });
            return result;
        }
        catch (error) {
            spanLogger.error(`Error in ${name}`, {
                error: error instanceof Error ? error.message : String(error),
                duration: span.getDuration(),
            });
            throw error;
        }
        finally {
            span.end();
        }
    }
    shutdown() {
        this.tracer.finishAll();
    }
}
export const debug = DebugModule.getInstance();
export function createDebugLogger(target) {
    return debug.getLogger(target);
}
export function createTracer() {
    return debug.getTracer();
}
export function instrument(name, fn, target, metadata) {
    return debug.instrument(name, fn, target, metadata);
}
export async function instrumentAsync(name, fn, target, metadata) {
    return debug.instrumentAsync(name, fn, target, metadata);
}
export const trace = (target = 'default') => debug.getLogger(target).trace.bind(debug.getLogger(target));
export const debug_log = (target = 'default') => debug.getLogger(target).debug.bind(debug.getLogger(target));
export const info = (target = 'default') => debug.getLogger(target).info.bind(debug.getLogger(target));
export const warn = (target = 'default') => debug.getLogger(target).warn.bind(debug.getLogger(target));
export const error = (target = 'default') => debug.getLogger(target).error.bind(debug.getLogger(target));
//# sourceMappingURL=index.js.map