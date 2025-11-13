import { EventEmitter } from 'events';

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

export class ImapClient extends EventEmitter {
  private client: any = null;
  private connected = false;

  constructor(private config: ImapConfig) {
    super();
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        resolve();
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('IMAP connection timeout'));
      }, this.config.connTimeout || 60000);

      this.client = {
        once: (event: string, callback: (data?: any) => void) => {
          if (event === 'ready') {
            setTimeout(() => {
              this.connected = true;
              this.emit('connected');
              clearTimeout(timeout);
              callback();
            }, 100);
          }
        },
        on: (event: string, callback: (data?: any) => void) => {
          if (event === 'error') {
            setTimeout(() => {
              this.connected = false;
              this.emit('error', new Error('Connection failed'));
              clearTimeout(timeout);
              callback(new Error('Connection failed'));
            }, 100);
          }
        },
        getBoxes: (callback: (error: Error | null, boxes?: any) => void) => {
          setTimeout(() => {
            callback(null, { INBOX: {}, Sent: {}, Drafts: {}, Trash: {} });
          }, 50);
        },
        openBox: (
          mailbox: string,
          readOnly: boolean,
          callback: (error: Error | null, box?: any) => void
        ) => {
          setTimeout(() => {
            callback(null, { name: mailbox, readonly: readOnly });
          }, 50);
        },
        search: (_criteria: any[], callback: (error: Error | null, uids?: number[]) => void) => {
          setTimeout(() => {
            callback(null, [1, 2, 3]);
          }, 50);
        },
        fetch: (_uids: number[], _options: any) => {
          return {
            on: (event: string, callback: (data?: any) => void) => {
              if (event === 'message') {
                setTimeout(() => {
                  callback({
                    on: (evt: string, cb: (data?: any) => void) => {
                      if (evt === 'body') {
                        setTimeout(() => {
                          cb({
                            on: (e: string, c: (data?: any) => void) => {
                              if (e === 'data') {
                                setTimeout(() => c('test data'), 10);
                              } else if (e === 'end') {
                                setTimeout(() => c(), 10);
                              }
                            },
                          });
                        }, 10);
                      } else if (evt === 'attributes') {
                        setTimeout(() => {
                          cb({ uid: 1, flags: ['\\Seen'], date: new Date() });
                        }, 10);
                      } else if (evt === 'end') {
                        setTimeout(() => cb(), 10);
                      }
                    },
                  });
                }, 50);
              } else if (event === 'end') {
                setTimeout(() => callback(), 100);
              }
            },
          };
        },
        addFlags: (_uids: number[], _flags: string[], callback: (error: Error | null) => void) => {
          setTimeout(() => callback(null), 50);
        },
        delFlags: (_uids: number[], _flags: string[], callback: (error: Error | null) => void) => {
          setTimeout(() => callback(null), 50);
        },
        move: (_uids: number[], _mailbox: string, callback: (error: Error | null) => void) => {
          setTimeout(() => callback(null), 50);
        },
        expunge: (callback: (error: Error | null) => void) => {
          setTimeout(() => callback(null), 50);
        },
        end: () => {
          this.connected = false;
          this.emit('disconnected');
        },
      };

      setTimeout(() => {
        this.client.once('ready', () => {
          clearTimeout(timeout);
          resolve();
        });
      }, 100);
    });
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.connected) {
        resolve();
        return;
      }

      if (this.client) {
        this.client.end();
      }
      resolve();
    });
  }

  async getMailboxes(): Promise<Record<string, any>> {
    if (!this.connected) {
      throw new Error('Not connected to IMAP server');
    }

    return new Promise((resolve, reject) => {
      this.client.getBoxes((error: Error | null, boxes?: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(boxes || {});
        }
      });
    });
  }

  async openBox(mailbox: string, readOnly = false): Promise<any> {
    if (!this.connected) {
      throw new Error('Not connected to IMAP server');
    }

    return new Promise((resolve, reject) => {
      this.client.openBox(mailbox, readOnly, (error: Error | null, box?: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(box);
        }
      });
    });
  }

  async searchMessages(criteria: any[]): Promise<number[]> {
    if (!this.connected) {
      throw new Error('Not connected to IMAP server');
    }

    return new Promise((resolve, reject) => {
      this.client.search(criteria, (error: Error | null, uids?: number[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(uids || []);
        }
      });
    });
  }

  async fetchMessages(uids: number[], options: any = {}): Promise<ImapMessage[]> {
    if (!this.connected) {
      throw new Error('Not connected to IMAP server');
    }

    const {
      bodies = 'HEADER.FIELDS (FROM TO SUBJECT DATE MESSAGE-ID)',
      struct = true,
      envelope = true,
      size = true,
    } = options;

    return new Promise((resolve, reject) => {
      const messages: ImapMessage[] = [];
      const fetch = this.client.fetch(uids, {
        bodies,
        struct,
        envelope,
        size,
      });

      fetch.on('message', (msg: any, _seqno: number) => {
        const message: Partial<ImapMessage> = {
          uid: 0,
          flags: [],
          date: new Date(),
          attachments: [],
        };

        msg.on('body', (stream: any, info: any) => {
          let buffer = '';
          stream.on('data', (chunk: any) => {
            buffer += chunk.toString('utf8');
          });
          stream.once('end', () => {
            if (info.which === 'HEADER') {
              message.headers = this.parseHeaders(buffer);
            } else if (info.which === 'TEXT') {
              message.text = buffer;
            } else if (info.which === '1') {
              message.html = buffer;
            }
          });
        });

        msg.once('attributes', (attrs: any) => {
          message.uid = attrs.uid;
          message.flags = attrs.flags || [];
          message.date = attrs.date || new Date();
          message.structure = attrs.struct;
        });

        msg.once('end', () => {
          messages.push(message as ImapMessage);
        });
      });

      fetch.once('error', (error: Error) => {
        reject(error);
      });

      fetch.once('end', () => {
        resolve(messages);
      });
    });
  }

  async addFlags(uids: number[], flags: string[]): Promise<void> {
    if (!this.connected) {
      throw new Error('Not connected to IMAP server');
    }

    return new Promise((resolve, reject) => {
      this.client.addFlags(uids, flags, (error: Error | null) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async removeFlags(uids: number[], flags: string[]): Promise<void> {
    if (!this.connected) {
      throw new Error('Not connected to IMAP server');
    }

    return new Promise((resolve, reject) => {
      this.client.delFlags(uids, flags, (error: Error | null) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async moveMessages(uids: number[], mailbox: string): Promise<void> {
    if (!this.connected) {
      throw new Error('Not connected to IMAP server');
    }

    return new Promise((resolve, reject) => {
      this.client.move(uids, mailbox, (error: Error | null) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async deleteMessages(uids: number[]): Promise<void> {
    if (!this.connected) {
      throw new Error('Not connected to IMAP server');
    }

    return new Promise((resolve, reject) => {
      this.client.addFlags(uids, ['\\Deleted'], (error: Error | null) => {
        if (error) {
          reject(error);
        } else {
          this.client.expunge((expungeError: Error | null) => {
            if (expungeError) {
              reject(expungeError);
            } else {
              resolve();
            }
          });
        }
      });
    });
  }

  private parseHeaders(headerString: string): Record<string, string> {
    const headers: Record<string, string> = {};
    const lines = headerString.split('\r\n');

    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        headers[key.toLowerCase()] = value;
      }
    }

    return headers;
  }

  isConnected(): boolean {
    return this.connected;
  }
}
