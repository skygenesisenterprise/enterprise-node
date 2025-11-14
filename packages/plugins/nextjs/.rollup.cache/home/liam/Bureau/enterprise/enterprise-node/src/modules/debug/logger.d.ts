import { LogLevel, LoggerConfig, Subscriber, SpanContext } from './types';
export declare class Logger {
    private config;
    private subscribers;
    private currentSpan?;
    constructor(config?: Partial<LoggerConfig>);
    setLevel(level: LogLevel): void;
    getLevel(): LogLevel;
    subscribe(subscriber: Subscriber): void;
    unsubscribe(subscriber: Subscriber): void;
    private shouldLog;
    private createRecord;
    private output;
    private outputToConsole;
    trace(message: string, fields?: Record<string, any>): void;
    debug(message: string, fields?: Record<string, any>): void;
    info(message: string, fields?: Record<string, any>): void;
    warn(message: string, fields?: Record<string, any>): void;
    error(message: string, fields?: Record<string, any>): void;
    withSpan(span: SpanContext): Logger;
    withFields(fields: Record<string, any>): Logger;
    withTarget(target: string): Logger;
}
//# sourceMappingURL=logger.d.ts.map