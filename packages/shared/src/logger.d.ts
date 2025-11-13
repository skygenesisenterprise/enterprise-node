import { LogEntry } from './types';
export declare class Logger {
    private static instance;
    private logs;
    private maxLogs;
    private debugMode;
    private constructor();
    static getInstance(): Logger;
    setDebugMode(enabled: boolean): void;
    debug(module: string, message: string, data?: any): void;
    info(module: string, message: string, data?: any): void;
    warn(module: string, message: string, data?: any): void;
    error(module: string, message: string, data?: any): void;
    private log;
    private outputToConsole;
    getLogs(level?: LogEntry['level'], module?: string): LogEntry[];
    clearLogs(): void;
    exportLogs(): string;
}
