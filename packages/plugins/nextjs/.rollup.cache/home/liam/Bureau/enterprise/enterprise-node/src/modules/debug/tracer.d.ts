import { SpanContext, Subscriber } from './types';
export declare class Span implements SpanContext {
    readonly span_id: string;
    readonly trace_id: string;
    readonly parent_span_id?: string;
    readonly name: string;
    readonly start_time: Date;
    metadata?: Record<string, any>;
    private end_time?;
    private subscribers;
    private children;
    constructor(name: string, trace_id?: string, parent_span_id?: string, metadata?: Record<string, any>);
    private generateId;
    addSubscriber(subscriber: Subscriber): void;
    removeSubscriber(subscriber: Subscriber): void;
    addChild(child: Span): void;
    setMetadata(metadata: Record<string, any>): void;
    getDuration(): number | null;
    end(): void;
    isFinished(): boolean;
    toContext(): SpanContext;
    static createRoot(name: string, metadata?: Record<string, any>): Span;
    static createChild(name: string, parent: SpanContext, metadata?: Record<string, any>): Span;
}
export declare class Tracer {
    private activeSpans;
    private subscribers;
    subscribe(subscriber: Subscriber): void;
    unsubscribe(subscriber: Subscriber): void;
    startSpan(name: string, parent?: SpanContext, metadata?: Record<string, any>): Span;
    endSpan(span_id: string): void;
    getActiveSpan(span_id: string): Span | undefined;
    getActiveSpans(): Span[];
    getCurrentSpan(): Span | undefined;
    inSpan<T>(name: string, fn: (span: Span) => T, parent?: SpanContext, metadata?: Record<string, any>): T;
    inSpanAsync<T>(name: string, fn: (span: Span) => Promise<T>, parent?: SpanContext, metadata?: Record<string, any>): Promise<T>;
    finishAll(): void;
}
