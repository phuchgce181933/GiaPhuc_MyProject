'use strict';

const { getTransporter } = require('../config/mail');
const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Plain HTML escape, just enough to render user-supplied values safely inside
 * email templates.
 */
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Centralised email service.
 * All outbound mail flows through here; the rest of the codebase never touches
 * nodemailer directly.  Failures are reported (not thrown) so callers can
 * continue with the rest of their workflow (e.g. account creation) and the
 * controller layer can return accurate "email notification status".
 */
class EmailService {
  async sendMail({ to, subject, html, text }) {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: `"${env.mail.fromName}" <${env.mail.user}>`,
      to,
      subject,
      html,
      text,
    });
    return { messageId: info.messageId, accepted: info.accepted };
  }

  async sendStaffAccountCreatedEmail({
    to,
    fullName,
    roleName,
    loginUrl,
    temporaryPassword,
  }) {
    const subject = 'Your staff account has been created';
    const safeName = escapeHtml(fullName);
    const safeRole = escapeHtml(roleName);
    const safeUrl = escapeHtml(loginUrl);
    const safePwd = escapeHtml(temporaryPassword || '');

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#222">
        <h2>Welcome, ${safeName}!</h2>
        <p>An administrator has created a staff account for you.</p>
        <table cellpadding="6" style="border-collapse:collapse">
          <tr><td><b>Email</b></td><td>${escapeHtml(to)}</td></tr>
          <tr><td><b>Role</b></td><td>${safeRole}</td></tr>
          ${
            temporaryPassword
              ? `<tr><td><b>Temporary password</b></td><td><code>${safePwd}</code></td></tr>`
              : ''
          }
        </table>
        <p>Please log in and change your password immediately:</p>
        <p><a href="${safeUrl}" target="_blank" rel="noopener">${safeUrl}</a></p>
        <p style="color:#888;font-size:12px">
          If you did not expect this email, please contact your administrator.
        </p>
      </div>
    `;

    const text = [
      `Welcome, ${fullName}!`,
      '',
      'An administrator has created a staff account for you.',
      `Email : ${to}`,
      `Role  : ${roleName}`,
      temporaryPassword ? `Temp password: ${temporaryPassword}` : '',
      '',
      `Login URL: ${loginUrl}`,
      '',
      'Please change your password after first login.',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const result = await this.sendMail({ to, subject, html, text });
      logger.info('Email notification sent', {
        to,
        subject,
        messageId: result.messageId,
      });
      return { ok: true, messageId: result.messageId };
    } catch (err) {
      // Never echo credentials in logs.
      logger.error('Email notification failed', { to, subject, error: err.message });
      return { ok: false, error: err.message };
    }
  }
}

module.exports = new EmailService();
