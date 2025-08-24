const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport({
  service: config.email.gmail.service,
  host: config.email.gmail.host,
  port: config.email.gmail.port,
  secure: false,
  auth: {
    user: config.email.gmail.auth.user,
    pass: config.email.gmail.auth.pass
  }
});
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} [html]
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html) => {
  const msg = { from: config.email.from, to, subject, text, html };
  await transport.sendMail(msg);
};

/**
 * Send welcome email to new users
 * @param {string} to
 * @param {string} username
 * @returns {Promise}
 */
const sendWelcomeEmail = async (to, username) => {
  const subject = 'Welcome to Our Platform';
  
  const text = `Dear ${username},
Welcome to our platform! We're excited to have you on board.
If you have any questions, please don't hesitate to reach out.`;

  const html = `
    <h1>Welcome!</h1>
    <p>Dear ${username},</p>
    <p>Welcome to our platform! We're excited to have you on board.</p>
    <p>If you have any questions, please don't hesitate to reach out.</p>
  `;

  await sendEmail(to, subject, text, html);
};

module.exports = {
  transport,
  sendEmail,
  sendWelcomeEmail
};
