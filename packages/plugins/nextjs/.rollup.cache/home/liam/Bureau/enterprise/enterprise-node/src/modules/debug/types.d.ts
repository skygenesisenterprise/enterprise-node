export declare enum LogLevel {
    TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4
}
export interface LogRecord {
    timestamp: Date;
    level: LogLevel;
    target: string;
    message: string;
    fields?: Record<string, any>;
    span?: SpanContext;
}
export interface SpanContext {
    span_id: string;
    trace_id: string;
    parent_span_id?: string;
    name: string;
    start_time: Date;
    metadata?: Record<string, any>;
}
export interface LoggerConfig {
    level: LogLevel;
    target: string;
    with_spans?: boolean;
    with_timestamps?: boolean;
    with_colors?: boolean;
    output?: 'console' | 'file' | 'custom';
    custom_output?: (record: LogRecord) => void;
}
export interface Subscriber {
    on_log(record: LogRecord): void;
    on_span_start(span: SpanContext): void;
    on_span_end(span: SpanContext): void;
}
export declare class DebugError extends Error {
    code?: string | undefined;
    context?: Record<string, any> | undefined;
    constructor(message: string, code?: string | undefined, context?: Record<string, any> | undefined);
}
