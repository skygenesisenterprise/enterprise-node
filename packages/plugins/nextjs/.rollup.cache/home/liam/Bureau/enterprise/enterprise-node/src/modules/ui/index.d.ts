import { ModuleInterface } from '../../types';
import { WasmRuntime } from '../../core/runtime';
export interface NotificationOptions {
    type?: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}
export interface ModalOptions {
    title?: string;
    content?: string;
    buttons?: Array<{
        text: string;
        action?: () => void;
        primary?: boolean;
    }>;
    closable?: boolean;
}
export declare class Ui implements ModuleInterface {
    name: string;
    version: string;
    private runtime;
    private notifications;
    constructor(runtime: WasmRuntime);
    init(): Promise<void>;
    destroy(): Promise<void>;
    notify(message: string, options?: NotificationOptions): Promise<{
        id: string;
        shown: boolean;
    }>;
    modal(options?: ModalOptions): Promise<{
        id: string;
        opened: boolean;
        result?: any;
    }>;
    toast(message: string, type?: NotificationOptions['type']): Promise<{
        id: string;
        shown: boolean;
    }>;
    removeNotification(id: string): boolean;
    clearAllNotifications(): void;
    getActiveNotifications(): Array<any>;
    private fallbackNotify;
    private fallbackModal;
    private getTypeColor;
    private injectStyles;
}
export default Ui;
//# sourceMappingURL=index.d.ts.map