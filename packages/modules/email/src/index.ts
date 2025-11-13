export * from './types';
export { ImapClient } from './imap';
export { SmtpClient } from './smtp';
export { Pop3Client } from './pop3';

import { EmailConfig, EmailMessage, SendEmailOptions, FetchEmailOptions } from './types';
import { ImapClient } from './imap';
import { SmtpClient } from './smtp';
import { Pop3Client } from './pop3';

export class EmailManager {
  private imapClient: ImapClient | null = null;
  private smtpClient: SmtpClient | null = null;
  private pop3Client: Pop3Client | null = null;
  private config: EmailConfig | null = null;

  constructor(config?: EmailConfig) {
    if (config) {
      this.configure(config);
    }
  }

  configure(config: EmailConfig): void {
    this.config = config;

    if (config.imap) {
      this.imapClient = new ImapClient(config.imap);
    }

    if (config.smtp) {
      this.smtpClient = new SmtpClient(config.smtp);
    }

    if (config.pop3) {
      this.pop3Client = new Pop3Client(config.pop3);
    }
  }

  async connectAll(): Promise<void> {
    const connections: Promise<void>[] = [];

    if (this.imapClient) {
      connections.push(this.imapClient.connect());
    }

    if (this.smtpClient) {
      connections.push(this.smtpClient.connect());
    }

    if (this.pop3Client) {
      connections.push(this.pop3Client.connect());
      connections.push(this.pop3Client.login());
    }

    await Promise.all(connections);
  }

  async disconnectAll(): Promise<void> {
    const disconnections: Promise<void>[] = [];

    if (this.imapClient) {
      disconnections.push(this.imapClient.disconnect());
    }

    if (this.smtpClient) {
      disconnections.push(this.smtpClient.disconnect());
    }

    if (this.pop3Client) {
      disconnections.push(this.pop3Client.disconnect());
    }

    await Promise.all(disconnections);
  }

  async sendEmail(options: SendEmailOptions): Promise<{
    messageId: string;
    accepted: string[];
    rejected: string[];
    pending: string[];
  }> {
    if (!this.smtpClient) {
      throw new Error('SMTP client not configured');
    }

    const emailOptions = {
      from: this.config!.smtp!.auth.user,
      ...options,
    };

    const result = await this.smtpClient.sendEmail(emailOptions);

    return {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      pending: result.pending,
    };
  }

  async fetchEmails(options: FetchEmailOptions = {}): Promise<EmailMessage[]> {
    if (this.imapClient) {
      return this.fetchWithImap(options);
    } else if (this.pop3Client) {
      return this.fetchWithPop3(options);
    } else {
      throw new Error('Neither IMAP nor POP3 client configured');
    }
  }

  private async fetchWithImap(options: FetchEmailOptions): Promise<EmailMessage[]> {
    if (!this.imapClient) {
      throw new Error('IMAP client not configured');
    }

    const mailbox = options.mailbox || 'INBOX';
    await this.imapClient.openBox(mailbox, true);

    let criteria: any[] = ['ALL'];

    if (options.unseen) {
      criteria = ['UNSEEN'];
    }

    if (options.since) {
      criteria.push(['SINCE', options.since]);
    }

    if (options.search) {
      if (options.search.from) {
        criteria.push(['FROM', options.search.from]);
      }
      if (options.search.to) {
        criteria.push(['TO', options.search.to]);
      }
      if (options.search.subject) {
        criteria.push(['SUBJECT', options.search.subject]);
      }
      if (options.search.body) {
        criteria.push(['BODY', options.search.body]);
      }
    }

    const uids = await this.imapClient.searchMessages(criteria);

    if (options.limit && uids.length > options.limit) {
      uids.splice(options.limit);
    }

    const imapMessages = await this.imapClient.fetchMessages(uids, {
      bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE MESSAGE-ID) TEXT',
      struct: true,
      envelope: true,
    });

    return imapMessages.map(this.convertImapToEmailMessage);
  }

  private async fetchWithPop3(options: FetchEmailOptions): Promise<EmailMessage[]> {
    if (!this.pop3Client) {
      throw new Error('POP3 client not configured');
    }

    const messages = await this.pop3Client.retrieveAllMessages();

    let filteredMessages = messages;

    if (options.unseen) {
      filteredMessages = filteredMessages.filter((msg) => !msg.headers['x-seen']);
    }

    if (options.since) {
      filteredMessages = filteredMessages.filter((msg) => msg.date >= options.since!);
    }

    if (options.search) {
      if (options.search.from) {
        filteredMessages = filteredMessages.filter((msg) =>
          msg.from.toLowerCase().includes(options.search.from!.toLowerCase())
        );
      }
      if (options.search.to) {
        filteredMessages = filteredMessages.filter((msg) =>
          msg.to.some((to) => to.toLowerCase().includes(options.search.to!.toLowerCase()))
        );
      }
      if (options.search.subject) {
        filteredMessages = filteredMessages.filter((msg) =>
          msg.subject.toLowerCase().includes(options.search.subject!.toLowerCase())
        );
      }
      if (options.search.body) {
        filteredMessages = filteredMessages.filter(
          (msg) =>
            (msg.text && msg.text.toLowerCase().includes(options.search.body!.toLowerCase())) ||
            (msg.html && msg.html.toLowerCase().includes(options.search.body!.toLowerCase()))
        );
      }
      if (options.search.to) {
        filteredMessages = filteredMessages.filter((msg) =>
          msg.to.some((to) => to.toLowerCase().includes(options.search.to!.toLowerCase()))
        );
      }
      if (options.search.subject) {
        filteredMessages = filteredMessages.filter((msg) =>
          msg.subject.toLowerCase().includes(options.search.subject!.toLowerCase())
        );
      }
      if (options.search.body) {
        filteredMessages = filteredMessages.filter(
          (msg) =>
            (msg.text && msg.text.toLowerCase().includes(options.search.body!.toLowerCase())) ||
            (msg.html && msg.html.toLowerCase().includes(options.search.body!.toLowerCase()))
        );
      }
    }

    if (options.limit && filteredMessages.length > options.limit) {
      filteredMessages = filteredMessages.slice(0, options.limit);
    }

    return filteredMessages.map(this.convertPop3ToEmailMessage);
  }

  private convertImapToEmailMessage(imapMessage: any): EmailMessage {
    return {
      id: imapMessage.uid.toString(),
      from: imapMessage.headers.from || '',
      to: this.parseAddresses(imapMessage.headers.to || ''),
      cc: this.parseAddresses(imapMessage.headers.cc || ''),
      subject: imapMessage.headers.subject || '',
      text: imapMessage.text,
      html: imapMessage.html,
      attachments: imapMessage.attachments.map((att: any) => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType,
      })),
      date: imapMessage.date,
      flags: imapMessage.flags,
      uid: imapMessage.uid,
    };
  }

  private convertPop3ToEmailMessage(pop3Message: any): EmailMessage {
    return {
      id: pop3Message.id.toString(),
      from: pop3Message.from,
      to: pop3Message.to,
      subject: pop3Message.subject,
      text: pop3Message.text,
      html: pop3Message.html,
      attachments: pop3Message.attachments.map((att: any) => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType,
      })),
      date: pop3Message.date,
      uid: pop3Message.id,
    };
  }

  private parseAddresses(addressString: string): string[] {
    if (!addressString) return [];

    return addressString
      .split(',')
      .map((addr) => addr.trim())
      .filter(Boolean);
  }

  getImapClient(): ImapClient | null {
    return this.imapClient;
  }

  getSmtpClient(): SmtpClient | null {
    return this.smtpClient;
  }

  getPop3Client(): Pop3Client | null {
    return this.pop3Client;
  }

  getConnectionStatus(): {
    imap: boolean;
    smtp: boolean;
    pop3: boolean;
  } {
    return {
      imap: this.imapClient?.isConnected() || false,
      smtp: this.smtpClient !== null,
      pop3: this.pop3Client?.isConnected() || false,
    };
  }
}
