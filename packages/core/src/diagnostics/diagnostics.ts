import { Logger, LogEntry, TelemetryEvent } from '@skygenesisenterprise/shared';

export class DiagnosticsCollector {
  private static instance: DiagnosticsCollector;
  private logger = Logger.getInstance();
  private telemetryEvents: TelemetryEvent[] = [];
  private maxEvents = 1000;
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  static getInstance(): DiagnosticsCollector {
    if (!DiagnosticsCollector.instance) {
      DiagnosticsCollector.instance = new DiagnosticsCollector();
    }
    return DiagnosticsCollector.instance;
  }

  recordEvent(type: string, data: any, userId?: string): void {
    const event: TelemetryEvent = {
      type,
      timestamp: Date.now(),
      data,
      userId,
      sessionId: this.sessionId
    };

    this.telemetryEvents.push(event);
    
    if (this.telemetryEvents.length > this.maxEvents) {
      this.telemetryEvents.shift();
    }

    this.logger.debug('diagnostics', `Event recorded: ${type}`, { data });
  }

  getEvents(type?: string, userId?: string): TelemetryEvent[] {
    return this.telemetryEvents.filter(event => {
      if (type && event.type !== type) return false;
      if (userId && event.userId !== userId) return false;
      return true;
    });
  }

  clearEvents(): void {
    this.telemetryEvents = [];
    this.logger.debug('diagnostics', 'Telemetry events cleared');
  }

  exportEvents(): string {
    return JSON.stringify(this.telemetryEvents, null, 2);
  }

  getSessionId(): string {
    return this.sessionId;
  }

  generateDiagnosticReport(): {
    timestamp: number;
    sessionId: string;
    logs: LogEntry[];
    events: TelemetryEvent[];
    summary: {
      totalLogs: number;
      totalEvents: number;
      errorCount: number;
      warningCount: number;
      modules: string[];
    };
  } {
    const logs = this.logger.getLogs();
    const events = this.getEvents();
    
    const errorCount = logs.filter(log => log.level === 'error').length;
    const warningCount = logs.filter(log => log.level === 'warn').length;
    const modules = [...new Set(logs.map(log => log.module))];

    return {
      timestamp: Date.now(),
      sessionId: this.sessionId,
      logs,
      events,
      summary: {
        totalLogs: logs.length,
        totalEvents: events.length,
        errorCount,
        warningCount,
        modules
      }
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}