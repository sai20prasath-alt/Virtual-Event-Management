const EventModel = require('../models/eventModel');
const UserModel = require('../models/userModel');
const EmailService = require('../services/emailService');
const EventService = require('../services/eventService');
const logger = require('../utils/logger');
const { formatResponse, formatError } = require('../utils/responseFormatter');

class ParticipantController {
  static async registerForEvent(req, res) {
    try {
      const { eventId } = req.params;
      const userId = req.user.userId;

      // Verify event exists
      const event = EventModel.findById(eventId);
      if (!event) {
        logger.warn(`Registration attempt for non-existent event: ${eventId}`);
        return res.status(404).json(
          formatError('Event not found', 404)
        );
      }

      // Check if already registered
      if (EventModel.isParticipant(eventId, userId)) {
        logger.warn(`Duplicate registration attempt for user ${userId} in event ${eventId}`);
        return res.status(400).json(
          formatError('User already registered for this event', 400)
        );
      }

      // Try to add participant
      const updatedEvent = EventModel.addParticipant(eventId, userId);

      if (!updatedEvent) {
        logger.warn(`Event full: ${eventId}`);
        return res.status(400).json(
          formatError('Event is at maximum capacity', 400)
        );
      }

      // Send confirmation email asynchronously
      const user = UserModel.findById(userId);
      EmailService.sendEventRegistrationEmail(
        user.email,
        event.title,
        user.name
      ).catch((error) => {
        logger.error('Failed to send event registration email', error);
      });

      logger.info(`User ${userId} registered for event ${eventId}`);

      res.status(201).json(
        formatResponse(
          {
            eventId,
            userId,
            participantCount: EventModel.getParticipantCount(eventId),
          },
          'Successfully registered for event',
          201
        )
      );
    } catch (error) {
      logger.error('Event registration error', error);
      res.status(500).json(formatError(error.message, 500, error));
    }
  }

  static async unregisterFromEvent(req, res) {
    try {
      const { eventId } = req.params;
      const userId = req.user.userId;

      // Verify event exists
      const event = EventModel.findById(eventId);
      if (!event) {
        logger.warn(`Unregister attempt for non-existent event: ${eventId}`);
        return res.status(404).json(
          formatError('Event not found', 404)
        );
      }

      // Check if user is registered
      if (!EventModel.isParticipant(eventId, userId)) {
        logger.warn(`Unregister attempt for non-registered user ${userId} in event ${eventId}`);
        return res.status(400).json(
          formatError('User not registered for this event', 400)
        );
      }

      // Remove participant
      EventModel.removeParticipant(eventId, userId);

      logger.info(`User ${userId} unregistered from event ${eventId}`);

      res.json(
        formatResponse(
          { eventId, userId },
          'Successfully unregistered from event'
        )
      );
    } catch (error) {
      logger.error('Event unregistration error', error);
      res.status(500).json(formatError(error.message, 500, error));
    }
  }

  static async getUserRegisteredEvents(req, res) {
    try {
      const userId = req.user.userId;
      const events = EventService.getUserRegisteredEvents(userId);

      logger.info(`Retrieved registered events for user: ${userId}`);

      res.json(
        formatResponse(events, 'Registered events retrieved successfully')
      );
    } catch (error) {
      logger.error('Error retrieving registered events', error);
      res.status(500).json(formatError(error.message, 500, error));
    }
  }

  static async getEventParticipants(req, res) {
    try {
      const { eventId } = req.params;

      // Verify event exists
      const event = EventModel.findById(eventId);
      if (!event) {
        logger.warn(`Fetch participants attempt for non-existent event: ${eventId}`);
        return res.status(404).json(
          formatError('Event not found', 404)
        );
      }

      // Get participant details
      const participantDetails = event.participants.map((userId) => {
        const user = UserModel.findById(userId);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      });

      logger.info(`Retrieved participants for event: ${eventId}`);

      res.json(
        formatResponse(
          {
            eventId,
            participantCount: participantDetail.length,
            participants: participantDetails,
          },
          'Event participants retrieved successfully'
        )
      );
    } catch (error) {
      logger.error('Error retrieving event participants', error);
      res.status(500).json(formatError(error.message, 500, error));
    }
  }
}

module.exports = ParticipantController;
