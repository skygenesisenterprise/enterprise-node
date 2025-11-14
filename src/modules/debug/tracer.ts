import { SpanContext, Subscriber } from './types';

export class Span implements SpanContext {
  readonly span_id: string;
  readonly trace_id: string;
  readonly parent_span_id?: string;
  readonly name: string;
  readonly start_time: Date;
  metadata?: Record<string, any>;

  private end_time?: Date;
  private subscribers: Subscriber[] = [];
  private children: Span[] = [];

  constructor(
    name: string,
    trace_id?: string,
    parent_span_id?: string,
    metadata?: Record<string, any>
  ) {
    this.name = name;
    this.span_id = this.generateId();
    this.trace_id = trace_id || this.generateId();
    this.parent_span_id = parent_span_id;
    this.start_time = new Date();
    this.metadata = metadata;
  }

  private generateId(): string {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }

  addSubscriber(subscriber: Subscriber): void {
    this.subscribers.push(subscriber);
  }

  removeSubscriber(subscriber: Subscriber): void {
    const index = this.subscribers.indexOf(subscriber);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  addChild(child: Span): void {
    this.children.push(child);
  }

  setMetadata(metadata: Record<string, any>): void {
    this.metadata = { ...this.metadata, ...metadata };
  }

  getDuration(): number | null {
    if (!this.end_time) return null;
    return this.end_time.getTime() - this.start_time.getTime();
  }

  end(): void {
    this.end_time = new Date();
    this.subscribers.forEach((subscriber) => subscriber.on_span_end(this));
  }

  isFinished(): boolean {
    return this.end_time !== undefined;
  }

  toContext(): SpanContext {
    return {
      span_id: this.span_id,
      trace_id: this.trace_id,
      parent_span_id: this.parent_span_id,
      name: this.name,
      start_time: this.start_time,
      metadata: this.metadata,
    };
  }

  static createRoot(name: string, metadata?: Record<string, any>): Span {
    const span = new Span(name, undefined, undefined, metadata);
    return span;
  }

  static createChild(name: string, parent: SpanContext, metadata?: Record<string, any>): Span {
    const span = new Span(name, parent.trace_id, parent.span_id, metadata);
    return span;
  }
}

export class Tracer {
  private activeSpans: Map<string, Span> = new Map();
  private subscribers: Subscriber[] = [];

  subscribe(subscriber: Subscriber): void {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Subscriber): void {
    const index = this.subscribers.indexOf(subscriber);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  startSpan(name: string, parent?: SpanContext, metadata?: Record<string, any>): Span {
    const span = parent
      ? Span.createChild(name, parent, metadata)
      : Span.createRoot(name, metadata);

    this.subscribers.forEach((subscriber) => {
      span.addSubscriber(subscriber);
      subscriber.on_span_start(span);
    });
    this.activeSpans.set(span.span_id, span);

    if (parent) {
      const parentSpan = this.activeSpans.get(parent.span_id);
      if (parentSpan) {
        parentSpan.addChild(span);
      }
    }

    return span;
  }

  endSpan(span_id: string): void {
    const span = this.activeSpans.get(span_id);
    if (span && !span.isFinished()) {
      span.end();
    }
    this.activeSpans.delete(span_id);
  }

  getActiveSpan(span_id: string): Span | undefined {
    return this.activeSpans.get(span_id);
  }

  getActiveSpans(): Span[] {
    return Array.from(this.activeSpans.values());
  }

  getCurrentSpan(): Span | undefined {
    const spans = Array.from(this.activeSpans.values());
    return spans[spans.length - 1];
  }

  inSpan<T>(
    name: string,
    fn: (span: Span) => T,
    parent?: SpanContext,
    metadata?: Record<string, any>
  ): T {
    const span = this.startSpan(name, parent, metadata);
    try {
      return fn(span);
    } finally {
      span.end();
      this.activeSpans.delete(span.span_id);
    }
  }

  async inSpanAsync<T>(
    name: string,
    fn: (span: Span) => Promise<T>,
    parent?: SpanContext,
    metadata?: Record<string, any>
  ): Promise<T> {
    const span = this.startSpan(name, parent, metadata);
    try {
      return await fn(span);
    } finally {
      span.end();
      this.activeSpans.delete(span.span_id);
    }
  }

  finishAll(): void {
    this.activeSpans.forEach((span) => {
      if (!span.isFinished()) {
        span.end();
      }
    });
    this.activeSpans.clear();
  }
}
