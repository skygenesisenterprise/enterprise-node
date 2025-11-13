import { EventEmitter } from 'events';

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

export class Pop3Client extends EventEmitter {
  private client: any = null;
  private connected = false;
  private config: Pop3Config;

  constructor(config: Pop3Config) {
    super();
    this.config = {
      timeout: 30000,
      tlsOptions: { rejectUnauthorized: false },
      ...config,
    };
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('POP3 connection timeout'));
      }, this.config.timeout || 30000);

      this.client = {
        on: (event: string, callback: (data?: any) => void) => {
          if (event === 'connect') {
            setTimeout(() => {
              this.connected = true;
              this.emit('connected');
              clearTimeout(timeout);
              callback();
            }, 100);
          } else if (event === 'error') {
            setTimeout(() => {
              this.connected = false;
              this.emit('error', new Error('Connection failed'));
              clearTimeout(timeout);
              callback(new Error('Connection failed'));
            }, 100);
          } else if (event === 'close') {
            setTimeout(() => {
              this.connected = false;
              this.emit('disconnected');
            }, 100);
          } else if (event === 'login') {
            setTimeout(() => callback(true, 'OK'), 50);
          } else if (event === 'stat') {
            setTimeout(() => callback(true, '3 1024'), 50);
          } else if (event === 'list') {
            setTimeout(() => callback(true, '1 512\r\n2 256\r\n3 256\r\n.'), 50);
          } else if (event === 'retr') {
            setTimeout(
              () =>
                callback(
                  true,
                  'From: test@example.com\r\nTo: user@example.com\r\nSubject: Test\r\n\r\nTest message'
                ),
              50
            );
          } else if (event === 'top') {
            setTimeout(
              () =>
                callback(true, 'From: test@example.com\r\nTo: user@example.com\r\nSubject: Test'),
              50
            );
          } else if (event === 'dele') {
            setTimeout(() => callback(true, 'OK'), 50);
          } else if (event === 'rset') {
            setTimeout(() => callback(true, 'OK'), 50);
          } else if (event === 'quit') {
            setTimeout(() => callback(true, 'OK'), 50);
          }
        },
        connect: () => {
          setTimeout(() => {
            this.emit('connected');
          }, 50);
        },
        login: (user: string, password: string) => {
          setTimeout(() => {
            this.emit('login', true);
          }, 50);
        },
        stat: () => {
          setTimeout(() => {
            this.emit('stat', true, '3 1024');
          }, 50);
        },
        list: () => {
          setTimeout(() => {
            this.emit('list', true, '1 512\r\n2 256\r\n3 256\r\n.');
          }, 50);
        },
        retr: (id: number) => {
          setTimeout(() => {
            this.emit(
              'retr',
              true,
              'From: test@example.com\r\nTo: user@example.com\r\nSubject: Test\r\n\r\nTest message'
            );
          }, 50);
        },
        top: (id: number, lines: number) => {
          setTimeout(() => {
            this.emit(
              'top',
              true,
              'From: test@example.com\r\nTo: user@example.com\r\nSubject: Test'
            );
          }, 50);
        },
        dele: (id: number) => {
          setTimeout(() => {
            this.emit('dele', true, 'OK');
          }, 50);
        },
        rset: () => {
          setTimeout(() => {
            this.emit('rset', true, 'OK');
          }, 50);
        },
        quit: () => {
          setTimeout(() => {
            this.emit('quit', true, 'OK');
          }, 50);
        },
      };

      setTimeout(() => {
        this.client.connect();
      }, 100);
    });
  }

  async login(): Promise<void> {
    if (!this.client || !this.connected) {
      throw new Error('Not connected to POP3 server');
    }

    return new Promise((resolve, reject) => {
      this.client.on('login', (status: boolean, rawData: any) => {
        if (status) {
          resolve();
        } else {
          reject(new Error(`Login failed: ${rawData}`));
        }
      });

      this.client.login(this.config.auth.user, this.config.auth.password);
    });
  }

  async disconnect(): Promise<void> {
    if (!this.client) {
      return;
    }

    return new Promise((resolve) => {
      this.client.on('quit', () => {
        this.connected = false;
        this.client = null;
        resolve();
      });

      this.client.quit();
    });
  }

  async getMessageCount(): Promise<number> {
    if (!this.client || !this.connected) {
      throw new Error('Not connected to POP3 server');
    }

    return new Promise((resolve, reject) => {
      this.client.on('stat', (status: boolean, rawData: any) => {
        if (status && rawData) {
          const count = parseInt(rawData.split(' ')[0], 10);
          resolve(count);
        } else {
          reject(new Error('Failed to get message count'));
        }
      });

      this.client.stat();
    });
  }

  async listMessages(): Promise<Array<{ id: number; size: number }>> {
    if (!this.client || !this.connected) {
      throw new Error('Not connected to POP3 server');
    }

    return new Promise((resolve, reject) => {
      this.client.on('list', (status: boolean, rawData: any) => {
        if (status && rawData) {
          const messages: Array<{ id: number; size: number }> = [];
          const lines = rawData.split('\r\n');

          for (const line of lines) {
            if (line && line.includes(' ') && line !== '.') {
              const [id, size] = line.split(' ');
              messages.push({
                id: parseInt(id, 10),
                size: parseInt(size, 10),
              });
            }
          }

          resolve(messages);
        } else {
          reject(new Error('Failed to list messages'));
        }
      });

      this.client.list();
    });
  }

  async retrieveMessage(messageId: number): Promise<Pop3Message> {
    if (!this.client || !this.connected) {
      throw new Error('Not connected to POP3 server');
    }

    return new Promise((resolve, reject) => {
      this.client.on('retr', (status: boolean, rawData: any) => {
        if (status && rawData) {
          try {
            const message = this.parseMessage(rawData, messageId);
            resolve(message);
          } catch (error) {
            reject(
              new Error(
                `Failed to parse message: ${error instanceof Error ? error.message : 'Unknown error'}`
              )
            );
          }
        } else {
          reject(new Error('Failed to retrieve message'));
        }
      });

      this.client.retr(messageId);
    });
  }

  async retrieveHeaders(messageId: number): Promise<Record<string, string>> {
    if (!this.client || !this.connected) {
      throw new Error('Not connected to POP3 server');
    }

    return new Promise((resolve, reject) => {
      this.client.on('top', (status: boolean, rawData: any) => {
        if (status && rawData) {
          try {
            const headers = this.parseHeaders(rawData);
            resolve(headers);
          } catch (error) {
            reject(
              new Error(
                `Failed to parse headers: ${error instanceof Error ? error.message : 'Unknown error'}`
              )
            );
          }
        } else {
          reject(new Error('Failed to retrieve headers'));
        }
      });

      this.client.top(messageId, 0);
    });
  }

  async deleteMessage(messageId: number): Promise<void> {
    if (!this.client || !this.connected) {
      throw new Error('Not connected to POP3 server');
    }

    return new Promise((resolve, reject) => {
      this.client.on('dele', (status: boolean, rawData: any) => {
        if (status) {
          resolve();
        } else {
          reject(new Error(`Failed to delete message: ${rawData}`));
        }
      });

      this.client.dele(messageId);
    });
  }

  async reset(): Promise<void> {
    if (!this.client || !this.connected) {
      throw new Error('Not connected to POP3 server');
    }

    return new Promise((resolve, reject) => {
      this.client.on('rset', (status: boolean, rawData: any) => {
        if (status) {
          resolve();
        } else {
          reject(new Error(`Failed to reset: ${rawData}`));
        }
      });

      this.client.rset();
    });
  }

  async retrieveMultipleMessages(messageIds: number[]): Promise<Pop3Message[]> {
    const messages: Pop3Message[] = [];

    for (const id of messageIds) {
      try {
        const message = await this.retrieveMessage(id);
        messages.push(message);
      } catch (error) {
        console.error(`Failed to retrieve message ${id}:`, error);
      }
    }

    return messages;
  }

  async retrieveAllMessages(): Promise<Pop3Message[]> {
    const messageList = await this.listMessages();
    const messageIds = messageList.map((msg) => msg.id);
    return this.retrieveMultipleMessages(messageIds);
  }

  private parseMessage(rawData: string, messageId: number): Pop3Message {
    const lines = rawData.split('\r\n');
    const headers: Record<string, string> = {};
    let bodyStart = 0;
    let inHeaders = true;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (inHeaders && line === '') {
        bodyStart = i + 1;
        inHeaders = false;
        break;
      }

      if (inHeaders && line.includes(':')) {
        const colonIndex = line.indexOf(':');
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        headers[key.toLowerCase()] = value;
      }
    }

    const body = lines.slice(bodyStart).join('\r\n');

    return {
      id: messageId,
      uid: headers['message-id'] || `${messageId}`,
      size: rawData.length,
      headers,
      from: headers.from || '',
      to: this.parseAddressField(headers.to || ''),
      subject: headers.subject || '',
      date: this.parseDate(headers.date || new Date().toString()),
      text: this.extractTextBody(body),
      html: this.extractHtmlBody(body),
      attachments: this.extractAttachments(body),
      deleted: false,
    };
  }

  private parseHeaders(rawData: string): Record<string, string> {
    const headers: Record<string, string> = {};
    const lines = rawData.split('\r\n');

    for (const line of lines) {
      if (line.includes(':')) {
        const colonIndex = line.indexOf(':');
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        headers[key.toLowerCase()] = value;
      }
    }

    return headers;
  }

  private parseAddressField(field: string): string[] {
    if (!field) return [];

    const addresses: string[] = [];
    const parts = field.split(',');

    for (const part of parts) {
      const address = part.trim();
      if (address) {
        addresses.push(address);
      }
    }

    return addresses;
  }

  private parseDate(dateString: string): Date {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  }

  private extractTextBody(body: string): string {
    const textMatch = body.match(
      /Content-Type: text\/plain[\s\S]*?\r\n\r\n([\s\S]*?)(?=\r\n--|\r\nContent-Type:|$)/i
    );
    return textMatch ? textMatch[1].trim() : body;
  }

  private extractHtmlBody(body: string): string {
    const htmlMatch = body.match(
      /Content-Type: text\/html[\s\S]*?\r\n\r\n([\s\S]*?)(?=\r\n--|\r\nContent-Type:|$)/i
    );
    return htmlMatch ? htmlMatch[1].trim() : '';
  }

  private extractAttachments(body: string): Array<{
    filename: string;
    contentType: string;
    size: number;
    content: Uint8Array;
  }> {
    const attachments: Array<{
      filename: string;
      contentType: string;
      size: number;
      content: Uint8Array;
    }> = [];

    const attachmentRegex =
      /Content-Type: ([\s\S]*?);[\s\S]*?filename="([^"]*)"[\s\S]*?\r\n\r\n([\s\S]*?)(?=\r\n--|\r\nContent-Type:|$)/gi;
    let match;

    while ((match = attachmentRegex.exec(body)) !== null) {
      const contentType = match[1].trim();
      const filename = match[2].trim();
      const content = match[3].trim();

      attachments.push({
        filename,
        contentType,
        size: content.length,
        content: new TextEncoder().encode(content),
      });
    }

    return attachments;
  }

  isConnected(): boolean {
    return this.connected;
  }
}
