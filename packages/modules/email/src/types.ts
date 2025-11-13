export interface EmailConfig {
  imap?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      password: string;
    };
    connTimeout?: number;
    authTimeout?: number;
  };
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      password: string;
    };
    pool?: boolean;
    maxConnections?: number;
    maxMessages?: number;
    rateDelta?: number;
    rateLimit?: number;
  };
  pop3?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      password: string;
    };
    timeout?: number;
    tlsOptions?: Record<string, unknown>;
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

export interface EmailAttachment {
  filename: string;
  content: string | Uint8Array;
  contentType?: string;
  encoding?: string;
  cid?: string;
  headers?: Record<string, string>;
}

export interface EmailOptions {
  from: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
  replyTo?: string;
  inReplyTo?: string;
  references?: string | string[];
  priority?: 'high' | 'normal' | 'low';
  headers?: Record<string, string>;
  messageId?: string;
  date?: Date;
  encoding?: string;
}

export interface SendResult {
  messageId: string;
  accepted: string[];
  rejected: string[];
  pending: string[];
  response: string;
  envelope: {
    from: string;
    to: string[];
  };
}

export interface ImapConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    password: string;
  };
  connTimeout?: number;
  authTimeout?: number;
}

export interface ImapMessage {
  uid: number;
  flags: string[];
  date: Date;
  structure: unknown;
  headers: Record<string, string>;
  text?: string;
  html?: string;
  attachments: Array<{
    filename: string;
    contentType: string;
    size: number;
    content: Uint8Array;
  }>;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    password: string;
  };
  pool?: boolean;
  maxConnections?: number;
  maxMessages?: number;
  rateDelta?: number;
  rateLimit?: number;
}

export interface Pop3Config {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    password: string;
  };
  timeout?: number;
  tlsOptions?: Record<string, unknown>;
}

export interface Pop3Message {
  id: number;
  uid: string;
  size: number;
  headers: Record<string, string>;
  from: string;
  to: string[];
  subject: string;
  date: Date;
  text?: string;
  html?: string;
  attachments: Array<{
    filename: string;
    contentType: string;
    size: number;
    content: Uint8Array;
  }>;
  deleted: boolean;
}

export type EmailProtocol = 'imap' | 'smtp' | 'pop3';

export interface EmailConnectionStatus {
  protocol: EmailProtocol;
  connected: boolean;
  host: string;
  port: number;
  secure: boolean;
  lastConnected?: Date;
  error?: string;
}

export interface EmailStats {
  totalMessages: number;
  unreadMessages: number;
  sentMessages: number;
  failedMessages: number;
  lastSync?: Date;
}
