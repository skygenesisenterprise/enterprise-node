import { LogEntry } from './types';

export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private debugMode = false;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  debug(module: string, message: string, data?: any): void {
    this.log('debug', module, message, data);
  }

  info(module: string, message: string, data?: any): void {
    this.log('info', module, message, data);
  }

  warn(module: string, message: string, data?: any): void {
    this.log('warn', module, message, data);
  }

  error(module: string, message: string, data?: any): void {
    this.log('error', module, message, data);
  }

  private log(level: LogEntry['level'], module: string, message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      module,
      message,
      data
    };

    this.logs.push(entry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (this.debugMode || level === 'error' || level === 'warn') {
      this.outputToConsole(entry);
    }
  }

  private outputToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.module}]`;
    
    switch (entry.level) {
      case 'debug':
        console.debug(prefix, entry.message, entry.data || '');
        break;
      case 'info':
        console.info(prefix, entry.message, entry.data || '');
        break;
      case 'warn':
        console.warn(prefix, entry.message, entry.data || '');
        break;
      case 'error':
        console.error(prefix, entry.message, entry.data || '');
        break;
    }
  }

  getLogs(level?: LogEntry['level'], module?: string): LogEntry[] {
    return this.logs.filter(entry => {
      if (level && entry.level !== level) return false;
      if (module && entry.module !== module) return false;
      return true;
    });
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}