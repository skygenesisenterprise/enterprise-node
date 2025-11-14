export class Span {
    constructor(name, trace_id, parent_span_id, metadata) {
        this.subscribers = [];
        this.children = [];
        this.name = name;
        this.span_id = this.generateId();
        this.trace_id = trace_id || this.generateId();
        this.parent_span_id = parent_span_id;
        this.start_time = new Date();
        this.metadata = metadata;
    }
    generateId() {
        return (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    }
    addSubscriber(subscriber) {
        this.subscribers.push(subscriber);
    }
    removeSubscriber(subscriber) {
        const index = this.subscribers.indexOf(subscriber);
        if (index > -1) {
            this.subscribers.splice(index, 1);
        }
    }
    addChild(child) {
        this.children.push(child);
    }
    setMetadata(metadata) {
        this.metadata = { ...this.metadata, ...metadata };
    }
    getDuration() {
        if (!this.end_time)
            return null;
        return this.end_time.getTime() - this.start_time.getTime();
    }
    end() {
        this.end_time = new Date();
        this.subscribers.forEach((subscriber) => subscriber.on_span_end(this));
    }
    isFinished() {
        return this.end_time !== undefined;
    }
    toContext() {
        return {
            span_id: this.span_id,
            trace_id: this.trace_id,
            parent_span_id: this.parent_span_id,
            name: this.name,
            start_time: this.start_time,
            metadata: this.metadata,
        };
    }
    static createRoot(name, metadata) {
        const span = new Span(name, undefined, undefined, metadata);
        return span;
    }
    static createChild(name, parent, metadata) {
        const span = new Span(name, parent.trace_id, parent.span_id, metadata);
        return span;
    }
}
export class Tracer {
    constructor() {
        this.activeSpans = new Map();
        this.subscribers = [];
    }
    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }
    unsubscribe(subscriber) {
        const index = this.subscribers.indexOf(subscriber);
        if (index > -1) {
            this.subscribers.splice(index, 1);
        }
    }
    startSpan(name, parent, metadata) {
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
    endSpan(span_id) {
        const span = this.activeSpans.get(span_id);
        if (span && !span.isFinished()) {
            span.end();
        }
        this.activeSpans.delete(span_id);
    }
    getActiveSpan(span_id) {
        return this.activeSpans.get(span_id);
    }
    getActiveSpans() {
        return Array.from(this.activeSpans.values());
    }
    getCurrentSpan() {
        const spans = Array.from(this.activeSpans.values());
        return spans[spans.length - 1];
    }
    inSpan(name, fn, parent, metadata) {
        const span = this.startSpan(name, parent, metadata);
        try {
            return fn(span);
        }
        finally {
            span.end();
            this.activeSpans.delete(span.span_id);
        }
    }
    async inSpanAsync(name, fn, parent, metadata) {
        const span = this.startSpan(name, parent, metadata);
        try {
            return await fn(span);
        }
        finally {
            span.end();
            this.activeSpans.delete(span.span_id);
        }
    }
    finishAll() {
        this.activeSpans.forEach((span) => {
            if (!span.isFinished()) {
                span.end();
            }
        });
        this.activeSpans.clear();
    }
}
//# sourceMappingURL=tracer.js.map