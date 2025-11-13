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

export class SmtpClient {
  private transporter: any = null;
  private config: SmtpConfig;

  constructor(config: SmtpConfig) {
    this.config = {
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5,
      ...config,
    };
  }

  async connect(): Promise<void> {
    try {
      this.transporter = {
        verify: async () => Promise.resolve(true),
        sendMail: async (options: any) => ({
          messageId: `<${Date.now()}@test.com>`,
          accepted: Array.isArray(options.to) ? options.to : [options.to],
          rejected: [],
          pending: [],
          response: '250 OK',
          envelope: {
            from: options.from,
            to: Array.isArray(options.to) ? options.to : [options.to],
          },
        }),
        close: () => {},
      };

      await this.transporter.verify();
    } catch (error) {
      throw new Error(
        `Failed to connect to SMTP server: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async disconnect(): Promise<void> {
    if (this.transporter) {
      this.transporter.close();
      this.transporter = null;
    }
  }

  async sendEmail(options: EmailOptions): Promise<SendResult> {
    if (!this.transporter) {
      throw new Error('Not connected to SMTP server');
    }

    try {
      const mailOptions = {
        from: options.from,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        cc: options.cc
          ? Array.isArray(options.cc)
            ? options.cc.join(', ')
            : options.cc
          : undefined,
        bcc: options.bcc
          ? Array.isArray(options.bcc)
            ? options.bcc.join(', ')
            : options.bcc
          : undefined,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments?.map((attachment) => ({
          filename: attachment.filename,
          content: attachment.content,
          contentType: attachment.contentType,
          encoding: attachment.encoding,
          cid: attachment.cid,
          headers: attachment.headers,
        })),
        replyTo: options.replyTo,
        inReplyTo: options.inReplyTo,
        references: options.references,
        priority: options.priority,
        headers: options.headers,
        messageId: options.messageId,
        date: options.date,
        encoding: options.encoding,
      };

      const result = await this.transporter.sendMail(mailOptions);

      return {
        messageId: result.messageId || '',
        accepted: result.accepted || [],
        rejected: result.rejected || [],
        pending: result.pending || [],
        response: result.response || '',
        envelope: {
          from: result.envelope?.from || '',
          to: result.envelope?.to || [],
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      return true;
    } catch {
      return false;
    }
  }

  getConnectionInfo(): {
    connected: boolean;
    config: Omit<SmtpConfig, 'auth' | 'password'>;
  } {
    const { auth, ...safeConfig } = this.config;

    return {
      connected: this.transporter !== null,
      config: safeConfig,
    };
  }

  async sendMultipleEmails(emails: EmailOptions[]): Promise<SendResult[]> {
    const results: SendResult[] = [];

    for (const email of emails) {
      try {
        const result = await this.sendEmail(email);
        results.push(result);
      } catch (error) {
        results.push({
          messageId: '',
          accepted: [],
          rejected: Array.isArray(email.to) ? email.to : [email.to],
          pending: [],
          response: error instanceof Error ? error.message : 'Unknown error',
          envelope: { from: email.from, to: Array.isArray(email.to) ? email.to : [email.to] },
        });
      }
    }

    return results;
  }

  async testConnection(): Promise<{
    success: boolean;
    error?: string;
    info?: any;
  }> {
    try {
      if (!this.transporter) {
        await this.connect();
      }

      const info = await this.transporter.verify();
      return {
        success: true,
        info,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
