import { ModuleInterface } from '../../types';
import { WasmRuntime } from '../../core/runtime';

export interface EmailConfig {
  imap?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      password: string;
    };
  };
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      password: string;
    };
  };
  pop3?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      password: string;
    };
  };
}

export interface EmailMessage {
  id?: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: string | Uint8Array;
    contentType?: string;
  }>;
  date?: Date;
  flags?: string[];
  uid?: number;
}

export interface SendEmailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: string | Uint8Array;
    contentType?: string;
  }>;
}

export interface FetchEmailOptions {
  mailbox?: string;
  limit?: number;
  unseen?: boolean;
  since?: Date;
  search?: {
    from?: string;
    to?: string;
    subject?: string;
    body?: string;
  };
}

export class Email implements ModuleInterface {
  name = 'email';
  version = '0.1.0';
  private runtime: WasmRuntime;
  private config: EmailConfig | null = null;

  constructor(runtime: WasmRuntime) {
    this.runtime = runtime;
  }

  async init(): Promise<void> {
    console.log('Email Module initialized');
  }

  async destroy(): Promise<void> {
    console.log('Email Module destroyed');
  }

  async configure(config: EmailConfig): Promise<void> {
    this.config = config;
    await this.runtime.call('email_configure', config);
  }

  async sendEmail(options: SendEmailOptions): Promise<{
    messageId: string;
    accepted: string[];
    rejected: string[];
    pending: string[];
  }> {
    if (!this.config?.smtp) {
      throw new Error('SMTP configuration not found');
    }

    try {
      const result = await this.runtime.call('email_send', {
        config: this.config.smtp,
        options,
      });

      return {
        messageId: result.messageId || this.generateMessageId(),
        accepted: result.accepted || [],
        rejected: result.rejected || [],
        pending: result.pending || [],
      };
    } catch (error) {
      console.error('Send email failed:', error);
      throw new Error('Failed to send email');
    }
  }

  async fetchEmails(options: FetchEmailOptions = {}): Promise<EmailMessage[]> {
    if (!this.config?.imap && !this.config?.pop3) {
      throw new Error('IMAP or POP3 configuration not found');
    }

    try {
      const protocol = this.config.imap ? 'imap' : 'pop3';
      const config = this.config.imap || this.config.pop3;

      const result = await this.runtime.call('email_fetch', {
        protocol,
        config,
        options,
      });

      return (result.messages || []).map(this.formatEmailMessage);
    } catch (error) {
      console.error('Fetch emails failed:', error);
      throw new Error('Failed to fetch emails');
    }
  }

  async getMailboxes(): Promise<string[]> {
    if (!this.config?.imap) {
      throw new Error('IMAP configuration not found');
    }

    try {
      const result = await this.runtime.call('email_mailboxes', this.config.imap);
      return result.mailboxes || ['INBOX', 'Sent', 'Drafts', 'Trash'];
    } catch (error) {
      console.error('Get mailboxes failed:', error);
      throw new Error('Failed to get mailboxes');
    }
  }

  async markAsRead(messageId: string, mailbox?: string): Promise<boolean> {
    if (!this.config?.imap) {
      throw new Error('IMAP configuration not found');
    }

    try {
      const result = await this.runtime.call('email_mark_read', {
        config: this.config.imap,
        messageId,
        mailbox: mailbox || 'INBOX',
      });
      return result.success !== false;
    } catch (error) {
      console.error('Mark as read failed:', error);
      return false;
    }
  }

  async deleteEmail(messageId: string, mailbox?: string): Promise<boolean> {
    if (!this.config?.imap) {
      throw new Error('IMAP configuration not found');
    }

    try {
      const result = await this.runtime.call('email_delete', {
        config: this.config.imap,
        messageId,
        mailbox: mailbox || 'INBOX',
      });
      return result.success !== false;
    } catch (error) {
      console.error('Delete email failed:', error);
      return false;
    }
  }

  async moveEmail(messageId: string, fromMailbox: string, toMailbox: string): Promise<boolean> {
    if (!this.config?.imap) {
      throw new Error('IMAP configuration not found');
    }

    try {
      const result = await this.runtime.call('email_move', {
        config: this.config.imap,
        messageId,
        fromMailbox,
        toMailbox,
      });
      return result.success !== false;
    } catch (error) {
      console.error('Move email failed:', error);
      return false;
    }
  }

  private formatEmailMessage(message: any): EmailMessage {
    return {
      id: message.id || message.messageId,
      from: message.from || '',
      to: Array.isArray(message.to) ? message.to : [message.to].filter(Boolean),
      cc: message.cc ? (Array.isArray(message.cc) ? message.cc : [message.cc]) : undefined,
      bcc: message.bcc ? (Array.isArray(message.bcc) ? message.bcc : [message.bcc]) : undefined,
      subject: message.subject || '',
      text: message.text,
      html: message.html,
      attachments: message.attachments || [],
      date: message.date ? new Date(message.date) : new Date(),
      flags: message.flags || [],
      uid: message.uid,
    };
  }

  private generateMessageId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `<${timestamp}.${random}@enterprise-sdk>`;
  }
}

export default Email;
