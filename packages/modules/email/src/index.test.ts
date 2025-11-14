import { describe, it, expect, vi } from 'vitest';
import { EmailManager } from './index';

// Mock SMTP and IMAP clients
vi.mock('./smtp', () => ({
  SmtpClient: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockResolvedValue(true),
    sendEmail: vi.fn().mockResolvedValue({ messageId: 'test-id' }),
    disconnect: vi.fn().mockResolvedValue(true),
  })),
}));

vi.mock('./imap', () => ({
  ImapClient: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockResolvedValue(true),
    openBox: vi.fn().mockResolvedValue({}),
    searchMessages: vi.fn().mockResolvedValue([1, 2, 3]),
    fetchMessages: vi.fn().mockResolvedValue([]),
    disconnect: vi.fn().mockResolvedValue(true),
  })),
}));

describe('Email Module', () => {
  it('should create an EmailManager instance', () => {
    const email = new EmailManager();
    expect(email).toBeInstanceOf(EmailManager);
  });

  it('should accept config in constructor', () => {
    const config = {
      smtp: {
        host: 'smtp.test.com',
        port: 587,
        secure: false,
        auth: { user: 'test', password: 'test' },
      },
      imap: {
        host: 'imap.test.com',
        port: 993,
        secure: true,
        auth: { user: 'test', password: 'test' },
      },
    };
    const email = new EmailManager(config);
    expect(email).toBeInstanceOf(EmailManager);
  });

  it('should configure email clients', () => {
    const email = new EmailManager();
    const config = {
      smtp: {
        host: 'smtp.test.com',
        port: 587,
        secure: false,
        auth: { user: 'test', password: 'test' },
      },
      imap: {
        host: 'imap.test.com',
        port: 993,
        secure: true,
        auth: { user: 'test', password: 'test' },
      },
    };
    email.configure(config);
    expect(email).toBeInstanceOf(EmailManager);
  });

  it('should send email via SMTP', async () => {
    const email = new EmailManager({
      smtp: {
        host: 'smtp.test.com',
        port: 587,
        secure: false,
        auth: { user: 'test', password: 'test' },
      },
    });

    const result = await email.sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      text: 'Test message',
    });
    expect(result.messageId).toBe('test-id');
  });

  it('should fetch emails via IMAP', async () => {
    const email = new EmailManager({
      imap: {
        host: 'imap.test.com',
        port: 993,
        secure: true,
        auth: { user: 'test', password: 'test' },
      },
    });

    const emails = await email.fetchEmails({ limit: 10 });
    expect(Array.isArray(emails)).toBe(true);
  });
});
