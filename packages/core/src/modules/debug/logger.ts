import { LogLevel, LogRecord, LoggerConfig, Subscriber, SpanContext } from './types';

export class Logger {
  private config: LoggerConfig;
  private subscribers: Subscriber[] = [];
  private currentSpan?: SpanContext;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      target: 'default',
      with_timestamps: true,
      with_colors: true,
      output: 'console',
      ...config,
    };
  }

  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  getLevel(): LogLevel {
    return this.config.level;
  }

  subscribe(subscriber: Subscriber): void {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Subscriber): void {
    const index = this.subscribers.indexOf(subscriber);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  private createRecord(level: LogLevel, message: string, fields?: Record<string, any>): LogRecord {
    return {
      timestamp: new Date(),
      level,
      target: this.config.target,
      message,
      fields,
      span: this.currentSpan,
    };
  }

  private output(record: LogRecord): void {
    switch (this.config.output) {
      case 'console':
        this.outputToConsole(record);
        break;
      case 'custom':
        if (this.config.custom_output) {
          this.config.custom_output(record);
        }
        break;
    }

    this.subscribers.forEach((subscriber) => subscriber.on_log(record));
  }

  private outputToConsole(record: LogRecord): void {
    const timestamp = this.config.with_timestamps ? `[${record.timestamp.toISOString()}] ` : '';

    const target = `[${record.target}]`;
    const spanInfo = record.span ? ` [${record.span.name}:${record.span.span_id.slice(0, 8)}]` : '';

    let levelStr: string;
    let colorCode: string = '';
    let resetCode: string = '';

    if (this.config.with_colors) {
      resetCode = '\x1b[0m';
      switch (record.level) {
        case LogLevel.TRACE:
          levelStr = 'TRACE';
          colorCode = '\x1b[90m'; // Gray
          break;
        case LogLevel.DEBUG:
          levelStr = 'DEBUG';
          colorCode = '\x1b[36m'; // Cyan
          break;
        case LogLevel.INFO:
          levelStr = 'INFO';
          colorCode = '\x1b[32m'; // Green
          break;
        case LogLevel.WARN:
          levelStr = 'WARN';
          colorCode = '\x1b[33m'; // Yellow
          break;
        case LogLevel.ERROR:
          levelStr = 'ERROR';
          colorCode = '\x1b[31m'; // Red
          break;
        default:
          levelStr = 'UNKNOWN';
          colorCode = '';
      }
    } else {
      switch (record.level) {
        case LogLevel.TRACE:
          levelStr = 'TRACE';
          break;
        case LogLevel.DEBUG:
          levelStr = 'DEBUG';
          break;
        case LogLevel.INFO:
          levelStr = 'INFO';
          break;
        case LogLevel.WARN:
          levelStr = 'WARN';
          break;
        case LogLevel.ERROR:
          levelStr = 'ERROR';
          break;
        default:
          levelStr = 'UNKNOWN';
      }
    }

    const prefix = `${timestamp}${target}${spanInfo} ${colorCode}[${levelStr}]${resetCode}`;
    const message = `${prefix} ${record.message}`;

    if (record.fields && Object.keys(record.fields).length > 0) {
      console.log(message, record.fields);
    } else {
      console.log(message);
    }
  }

  trace(message: string, fields?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.TRACE)) return;
    const record = this.createRecord(LogLevel.TRACE, message, fields);
    this.output(record);
  }

  debug(message: string, fields?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    const record = this.createRecord(LogLevel.DEBUG, message, fields);
    this.output(record);
  }

  info(message: string, fields?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    const record = this.createRecord(LogLevel.INFO, message, fields);
    this.output(record);
  }

  warn(message: string, fields?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    const record = this.createRecord(LogLevel.WARN, message, fields);
    this.output(record);
  }

  error(message: string, fields?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    const record = this.createRecord(LogLevel.ERROR, message, fields);
    this.output(record);
  }

  withSpan(span: SpanContext): Logger {
    const newLogger = new Logger(this.config);
    newLogger.currentSpan = span;
    newLogger.subscribers = [...this.subscribers];
    return newLogger;
  }

  withFields(fields: Record<string, any>): Logger {
    const newLogger = new Logger(this.config);
    newLogger.currentSpan = this.currentSpan;
    newLogger.subscribers = [...this.subscribers];

    const originalOutput = newLogger.output.bind(newLogger);
    newLogger.output = (record: LogRecord) => {
      record.fields = { ...fields, ...record.fields };
      originalOutput(record);
    };

    return newLogger;
  }

  withTarget(target: string): Logger {
    const newLogger = new Logger({ ...this.config, target });
    newLogger.currentSpan = this.currentSpan;
    newLogger.subscribers = [...this.subscribers];
    return newLogger;
  }
}
