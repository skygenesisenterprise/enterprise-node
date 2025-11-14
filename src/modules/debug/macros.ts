import { debug, createDebugLogger } from './index';

export function debug_macro(target: string, message: string, ...fields: any[]): void {
  const logger = createDebugLogger(target);
  logger.debug(message, fields.length > 0 ? { data: fields } : undefined);
}

export function info_macro(target: string, message: string, ...fields: any[]): void {
  const logger = createDebugLogger(target);
  logger.info(message, fields.length > 0 ? { data: fields } : undefined);
}

export function warn_macro(target: string, message: string, ...fields: any[]): void {
  const logger = createDebugLogger(target);
  logger.warn(message, fields.length > 0 ? { data: fields } : undefined);
}

export function error_macro(target: string, message: string, ...fields: any[]): void {
  const logger = createDebugLogger(target);
  logger.error(message, fields.length > 0 ? { data: fields } : undefined);
}

export function trace_macro(target: string, message: string, ...fields: any[]): void {
  const logger = createDebugLogger(target);
  logger.trace(message, fields.length > 0 ? { data: fields } : undefined);
}

export function span_macro<T>(
  target: string,
  name: string,
  fn: (span: any) => T,
  metadata?: Record<string, any>
): T {
  return debug.instrument(name, fn, target, metadata);
}

export async function async_span_macro<T>(
  target: string,
  name: string,
  fn: (span: any) => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  return debug.instrumentAsync(name, fn, target, metadata);
}

export function create_macros(target: string) {
  return {
    trace: (message: string, ...fields: any[]) => trace_macro(target, message, ...fields),
    debug: (message: string, ...fields: any[]) => debug_macro(target, message, ...fields),
    info: (message: string, ...fields: any[]) => info_macro(target, message, ...fields),
    warn: (message: string, ...fields: any[]) => warn_macro(target, message, ...fields),
    error: (message: string, ...fields: any[]) => error_macro(target, message, ...fields),
    span: <T>(name: string, fn: () => T, metadata?: Record<string, any>) =>
      span_macro(target, name, fn, metadata),
    asyncSpan: <T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>) =>
      async_span_macro(target, name, fn, metadata),
  };
}

export const log = create_macros('enterprise');
export const runtime_log = create_macros('runtime');
export const wasm_log = create_macros('wasm');
export const ai_log = create_macros('ai');
export const storage_log = create_macros('storage');
export const auth_log = create_macros('auth');
export const ui_log = create_macros('ui');
export const project_log = create_macros('project');
