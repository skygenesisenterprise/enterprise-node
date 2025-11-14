import { debug, createDebugLogger } from './index';
export function debug_macro(target, message, ...fields) {
    const logger = createDebugLogger(target);
    logger.debug(message, fields.length > 0 ? { data: fields } : undefined);
}
export function info_macro(target, message, ...fields) {
    const logger = createDebugLogger(target);
    logger.info(message, fields.length > 0 ? { data: fields } : undefined);
}
export function warn_macro(target, message, ...fields) {
    const logger = createDebugLogger(target);
    logger.warn(message, fields.length > 0 ? { data: fields } : undefined);
}
export function error_macro(target, message, ...fields) {
    const logger = createDebugLogger(target);
    logger.error(message, fields.length > 0 ? { data: fields } : undefined);
}
export function trace_macro(target, message, ...fields) {
    const logger = createDebugLogger(target);
    logger.trace(message, fields.length > 0 ? { data: fields } : undefined);
}
export function span_macro(target, name, fn, metadata) {
    return debug.instrument(name, fn, target, metadata);
}
export async function async_span_macro(target, name, fn, metadata) {
    return debug.instrumentAsync(name, fn, target, metadata);
}
export function create_macros(target) {
    return {
        trace: (message, ...fields) => trace_macro(target, message, ...fields),
        debug: (message, ...fields) => debug_macro(target, message, ...fields),
        info: (message, ...fields) => info_macro(target, message, ...fields),
        warn: (message, ...fields) => warn_macro(target, message, ...fields),
        error: (message, ...fields) => error_macro(target, message, ...fields),
        span: (name, fn, metadata) => span_macro(target, name, fn, metadata),
        asyncSpan: (name, fn, metadata) => async_span_macro(target, name, fn, metadata),
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
//# sourceMappingURL=macros.js.map