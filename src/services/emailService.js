const logger = require('../utils/logger');

class EmailService {
  static async sendWelcomeEmail(email, name) {
    try {
      // Mock email sending - In production, replace with nodemailer or similar
      logger.info(`Welcome email sent to ${email} for user ${name}`);
      return Promise.resolve({
        success: true,
        message: `Welcome email sent to ${email}`,
      });
    } catch (error) {
      logger.error('Error sending welcome email', error);
      throw error;
    }
  }

  static async sendEventRegistrationEmail(email, eventTitle, userName) {
    try {
      // Mock email sending - In production, replace with nodemailer or similar
      logger.info(`Event registration email sent to ${email} for event ${eventTitle}`);
      return Promise.resolve({
        success: true,
        message: `Event registration confirmation sent to ${email}`,
      });
    } catch (error) {
      logger.error('Error sending event registration email', error);
      throw error;
    }
  }

  static async sendEventUpdateEmail(email, eventTitle, changes) {
    try {
      // Mock email sending - In production, replace with nodemailer or similar
      logger.info(`Event update email sent to ${email} for event ${eventTitle}`);
      return Promise.resolve({
        success: true,
        message: `Event update notification sent to ${email}`,
      });
    } catch (error) {
      logger.error('Error sending event update email', error);
      throw error;
    }
  }

  static async sendEventCancellationEmail(email, eventTitle) {
    try {
      // Mock email sending - In production, replace with nodemailer or similar
      logger.info(`Event cancellation email sent to ${email} for event ${eventTitle}`);
      return Promise.resolve({
        success: true,
        message: `Event cancellation notification sent to ${email}`,
      });
    } catch (error) {
      logger.error('Error sending event cancellation email', error);
      throw error;
    }
  }
}

module.exports = EmailService;
