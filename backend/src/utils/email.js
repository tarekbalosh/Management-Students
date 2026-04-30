const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
  port: process.env.EMAIL_PORT || 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Study Abroad CRM" <${process.env.EMAIL_FROM || 'noreply@studycrm.com'}>`,
      to,
      subject,
      html,
    });
    logger.info(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Email failed: ${error.message}`);
    return false;
  }
};

const getTemplate = (templateKey, variables) => {
  const templates = {
    application_accepted: `
      <h1>Congratulations!</h1>
      <p>Your application to <strong>{{universityName}}</strong> has been accepted.</p>
      <p>Current Status: {{status}}</p>
      <a href="{{link}}">View Details</a>
    `,
    visa_appointment: `
      <h1>Visa Appointment Scheduled</h1>
      <p>Your visa appointment has been set for: <strong>{{date}}</strong></p>
      <p>Location: {{location}}</p>
      <a href="{{link}}">Track Visa Status</a>
    `,
    payment_overdue: `
      <h1>Payment Overdue Notice</h1>
      <p>Your invoice <strong>{{invoiceNumber}}</strong> for amount <strong>{{amount}}</strong> is overdue.</p>
      <p>Due Date was: {{dueDate}}</p>
      <a href="{{link}}">Make Payment Now</a>
    `,
    document_missing: `
      <h1>Missing Documents</h1>
      <p>We require additional documents to process your application: <strong>{{documentNames}}</strong></p>
      <a href="{{link}}">Upload Documents</a>
    `
  };

  let html = templates[templateKey] || `<p>You have a new notification: {{message}}</p>`;
  
  Object.keys(variables).forEach(key => {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), variables[key]);
  });

  return html;
};

module.exports = { sendEmail, getTemplate };
