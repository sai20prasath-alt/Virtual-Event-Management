const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Initialize transporter based on email service configuration
const createTransporter = () => {
  const emailService = process.env.EMAIL_SERVICE?.toLowerCase();

  if (emailService === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else if (process.env.SMTP_HOST) {
    // For custom SMTP services
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    logger.warn('Email service not configured. Please check your .env file.');
    return null;
  }
};

// Lazy initialize transporter - will be created when first needed
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

class EmailService {
  static async sendWelcomeEmail(email, name) {
    try {
      const transporter = getTransporter();
      if (!transporter) {
        logger.warn(`Welcome email not sent (no transporter configured) to ${email} for user ${name}`);
        return {
          success: false,
          message: 'Email service not configured. Check your .env file.',
        };
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || `"${process.env.EMAIL_FROM_NAME || 'Virtual Event Management'}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Welcome to ${process.env.EMAIL_FROM_NAME || 'Virtual Event Management'}!`,
        html: `
          <h2>Welcome ${name}!</h2>
          <p>Thank you for signing up with us.</p>
          <p>You can now:</p>
          <ul>
            <li>Create and manage events</li>
            <li>Register for events</li>
            <li>Connect with other attendees</li>
          </ul>
          <p>Happy event planning!</p>
          <p>Best regards,<br/>Virtual Event Management Team</p>
        `,
        text: `Welcome ${name}! Thank you for signing up with us.`,
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info(`Welcome email sent to ${email} for user ${name}. Message ID: ${info.messageId}`);
      return {
        success: true,
        message: `Welcome email sent to ${email}`,
        messageId: info.messageId,
      };
    } catch (error) {
      logger.error('Error sending welcome email', error);
      throw error;
    }
  }

  static async sendEventRegistrationEmail(email, eventTitle, userName) {
    try {
      const transporter = getTransporter();
      if (!transporter) {
        logger.warn(`Event registration email not sent (no transporter configured) to ${email}`);
        return {
          success: false,
          message: 'Email service not configured. Check your .env file.',
        };
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || `"${process.env.EMAIL_FROM_NAME || 'Virtual Event Management'}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Registration Confirmation: ${eventTitle}`,
        html: `
          <h2>Registration Confirmation</h2>
          <p>Hi ${userName},</p>
          <p>You have successfully registered for: <strong>${eventTitle}</strong></p>
          <p>You will receive further details about the event soon.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br/>Virtual Event Management Team</p>
        `,
        text: `You have successfully registered for: ${eventTitle}`,
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info(`Event registration email sent to ${email} for event ${eventTitle}. Message ID: ${info.messageId}`);
      return {
        success: true,
        message: `Event registration confirmation sent to ${email}`,
        messageId: info.messageId,
      };
    } catch (error) {
      logger.error('Error sending event registration email', error);
      throw error;
    }
  }

  static async sendEventUpdateEmail(email, eventTitle, changes) {
    try {
      const transporter = getTransporter();
      if (!transporter) {
        logger.warn(`Event update email not sent (no transporter configured) to ${email}`);
        return {
          success: false,
          message: 'Email service not configured. Check your .env file.',
        };
      }

      const changesText = Object.entries(changes)
        .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
        .join('');

      const mailOptions = {
        from: process.env.EMAIL_FROM || `"${process.env.EMAIL_FROM_NAME || 'Virtual Event Management'}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Update Notification: ${eventTitle}`,
        html: `
          <h2>Event Update</h2>
          <p>The following changes have been made to the event <strong>${eventTitle}</strong>:</p>
          <ul>
            ${changesText}
          </ul>
          <p>Please check your dashboard for more details.</p>
          <p>Best regards,<br/>Virtual Event Management Team</p>
        `,
        text: `The event "${eventTitle}" has been updated.`,
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info(`Event update email sent to ${email} for event ${eventTitle}. Message ID: ${info.messageId}`);
      return {
        success: true,
        message: `Event update notification sent to ${email}`,
        messageId: info.messageId,
      };
    } catch (error) {
      logger.error('Error sending event update email', error);
      throw error;
    }
  }

  static async sendEventCancellationEmail(email, eventTitle) {
    try {
      const transporter = getTransporter();
      if (!transporter) {
        logger.warn(`Event cancellation email not sent (no transporter configured) to ${email}`);
        return {
          success: false,
          message: 'Email service not configured. Check your .env file.',
        };
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || `"${process.env.EMAIL_FROM_NAME || 'Virtual Event Management'}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Cancellation Notice: ${eventTitle}`,
        html: `
          <h2>Event Cancellation</h2>
          <p>We regret to inform you that the event <strong>${eventTitle}</strong> has been cancelled.</p>
          <p>We apologize for any inconvenience this may cause.</p>
          <p>If you have any questions, please contact the event organizer.</p>
          <p>Best regards,<br/>Virtual Event Management Team</p>
        `,
        text: `The event "${eventTitle}" has been cancelled.`,
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info(`Event cancellation email sent to ${email} for event ${eventTitle}. Message ID: ${info.messageId}`);
      return {
        success: true,
        message: `Event cancellation notification sent to ${email}`,
        messageId: info.messageId,
      };
    } catch (error) {
      logger.error('Error sending event cancellation email', error);
      throw error;
    }
  }

  // Optional: Method to test email configuration
  static async testEmailConfiguration() {
    try {
      const transporter = getTransporter();
      if (!transporter) {
        return {
          success: false,
          message: 'Email transporter not configured. Check your .env file.',
        };
      }

      await transporter.verify();
      logger.info('Email transporter verified successfully');
      return {
        success: true,
        message: 'Email transporter is working correctly',
      };
    } catch (error) {
      logger.error('Email transporter verification failed', error);
      throw error;
    }
  }
}

module.exports = EmailService;
