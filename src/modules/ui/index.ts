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

export class Ui implements ModuleInterface {
  name = 'ui';
  version = '0.1.0';
  private runtime: WasmRuntime;
  private notifications: Array<any> = [];

  constructor(runtime: WasmRuntime) {
    this.runtime = runtime;
  }

  async init(): Promise<void> {
    console.log('UI Module initialized');
    this.injectStyles();
  }

  async destroy(): Promise<void> {
    this.clearAllNotifications();
    console.log('UI Module destroyed');
  }

  async notify(message: string, options: NotificationOptions = {}): Promise<{
    id: string;
    shown: boolean;
  }> {
    try {
      const notification = {
        id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message,
        type: options.type || 'info',
        duration: options.duration || 4000,
        position: options.position || 'top-right',
        timestamp: Date.now()
      };

      const result = await this.runtime.call('ui_notify', notification);
      this.notifications.push(notification);

      if (notification.duration > 0) {
        setTimeout(() => {
          this.removeNotification(notification.id);
        }, notification.duration);
      }

      return {
        id: notification.id,
        shown: result.shown !== false
      };
    } catch (error) {
      console.error('UI notify failed:', error);
      return this.fallbackNotify(message, options);
    }
  }

  async modal(options: ModalOptions = {}): Promise<{
    id: string;
    opened: boolean;
    result?: any;
  }> {
    try {
      const modal = {
        id: `modal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: options.title || 'Modal',
        content: options.content || '',
        buttons: options.buttons || [{ text: 'OK', primary: true }],
        closable: options.closable !== false
      };

      const result = await this.runtime.call('ui_modal', modal);
      return {
        id: modal.id,
        opened: result.opened !== false,
        result: result.result
      };
    } catch (error) {
      console.error('UI modal failed:', error);
      return this.fallbackModal(options);
    }
  }

  async toast(message: string, type: NotificationOptions['type'] = 'info'): Promise<{
    id: string;
    shown: boolean;
  }> {
    return this.notify(message, { type, duration: 3000 });
  }

  removeNotification(id: string): boolean {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index > -1) {
      this.notifications.splice(index, 1);
      return true;
    }
    return false;
  }

  clearAllNotifications(): void {
    this.notifications = [];
  }

  getActiveNotifications(): Array<any> {
    return [...this.notifications];
  }

  private fallbackNotify(message: string, options: NotificationOptions): {
    id: string;
    shown: boolean;
  } {
    const id = `fallback_${Date.now()}`;
    
    if (typeof window !== 'undefined') {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${this.getTypeColor(options.type || 'info')};
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      `;
      notification.textContent = message;
      document.body.appendChild(notification);

      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, options.duration || 4000);
    }

    return { id, shown: true };
  }

  private fallbackModal(options: ModalOptions): {
    id: string;
    opened: boolean;
    result?: any;
  } {
    const id = `fallback_modal_${Date.now()}`;
    
    if (typeof window !== 'undefined') {
      const result = window.confirm(options.content || options.title || 'Modal');
      return { id, opened: true, result };
    }

    return { id, opened: false };
  }

  private getTypeColor(type: NotificationOptions['type']): string {
    const colors = {
      info: '#007bff',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545'
    };
    return colors[type] || colors.info;
  }

  private injectStyles(): void {
    if (typeof document === 'undefined') return;

    const styleId = 'enterprise-ui-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .enterprise-notification {
        position: fixed;
        z-index: 10000;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        animation: enterprise-slide-in 0.3s ease-out;
      }
      
      @keyframes enterprise-slide-in {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}

export default Ui;