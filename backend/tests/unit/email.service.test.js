'use strict';

require('../setup');

// Mock the mail transport BEFORE importing the service.
jest.mock('../../src/config/mail', () => ({
  getTransporter: jest.fn(),
}));
jest.mock('../../src/config/env', () => ({
  mail: {
    user: 'tester@example.com',
    fromName: 'Test',
  },
  frontendUrl: 'http://example.test',
}));

const mailConfig = require('../../src/config/mail');
const emailService = require('../../src/services/email.service');

describe('EmailService', () => {
  test('N — returns ok:true on successful send', async () => {
    const sendMail = jest.fn().mockResolvedValue({
      messageId: 'm-1',
      accepted: ['staff@example.com'],
    });
    mailConfig.getTransporter.mockReturnValue({ sendMail });

    const result = await emailService.sendStaffAccountCreatedEmail({
      to: 'staff@example.com',
      fullName: 'Nguyen Van Test',
      roleName: 'STAFF',
      loginUrl: 'http://example.test/login',
      temporaryPassword: 'Sup3rSecret!',
    });

    expect(result.ok).toBe(true);
    expect(result.messageId).toBe('m-1');
    expect(sendMail).toHaveBeenCalledTimes(1);
    const args = sendMail.mock.calls[0][0];
    expect(args.to).toBe('staff@example.com');
    expect(args.subject).toMatch(/created/i);
    expect(args.html).toContain('Nguyen Van Test');
    expect(args.html).toContain('Sup3rSecret!');
  });

  test('N — does NOT throw on provider failure; returns ok:false', async () => {
    const sendMail = jest.fn().mockRejectedValue(new Error('smtp-down'));
    mailConfig.getTransporter.mockReturnValue({ sendMail });

    const result = await emailService.sendStaffAccountCreatedEmail({
      to: 'staff@example.com',
      fullName: 'Nguyen Van Test',
      roleName: 'STAFF',
      loginUrl: 'http://example.test/login',
      temporaryPassword: 'Sup3rSecret!',
    });

    expect(result.ok).toBe(false);
    expect(result.error).toBe('smtp-down');
  });

  test('B — HTML escapes user-supplied values to prevent template injection', async () => {
    const sendMail = jest.fn().mockResolvedValue({ messageId: 'm-2', accepted: ['x@y.com'] });
    mailConfig.getTransporter.mockReturnValue({ sendMail });

    await emailService.sendStaffAccountCreatedEmail({
      to: 'evil@example.com',
      fullName: '<script>alert(1)</script>',
      roleName: 'STAFF',
      loginUrl: 'http://example.test/login',
      temporaryPassword: 'pwd',
    });

    const args = sendMail.mock.calls[0][0];
    expect(args.html).not.toContain('<script>alert(1)</script>');
    expect(args.html).toContain('&lt;script&gt;');
  });
});
