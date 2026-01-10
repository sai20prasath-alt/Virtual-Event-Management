const EventService = require('../services/eventService');
const EventModel = require('../models/eventModel');
const UserModel = require('../models/userModel');
const logger = require('../utils/logger');
const { formatResponse, formatError } = require('../utils/responseFormatter');

class EventController {
  static async createEvent(req, res) {
    try {
      const { title, description, date, time, location, maxParticipants } = req.body;
      const organizerId = req.user.userId;

      // Verify user is organizer
      const user = UserModel.findById(organizerId);
      if (user.role !== 'organizer') {
        logger.warn(`Unauthorized event creation attempt by user: ${organizerId}`);
        return res.status(403).json(
          formatError('Only organizers can create events', 403)
        );
      }

      const event = EventService.createEvent(
        {
          title,
          description,
          date,
          time,
          location,
          maxParticipants,
        },
        organizerId
      );

      logger.info(`Event created: ${event.id} by user ${organizerId}`);

      res.status(201).json(
        formatResponse(event, 'Event created successfully', 201)
      );
    } catch (error) {
      logger.error('Event creation error', error);
      res.status(500).json(formatError(error.message, 500, error));
    }
  }

  static async getAllEvents(req, res) {
    try {
      const events = EventModel.getAll();

      logger.info(`Retrieved all events: ${events.length} events`);

      res.json(
        formatResponse(events, 'Events retrieved successfully')
      );
    } catch (error) {
      logger.error('Error retrieving events', error);
      res.status(500).json(formatError(error.message, 500, error));
    }
  }

  static async getEventById(req, res) {
    try {
      const { id } = req.params;
      const event = EventService.getEventDetails(id);

      logger.info(`Retrieved event: ${id}`);

      res.json(formatResponse(event, 'Event retrieved successfully'));
    } catch (error) {
      logger.error('Error retrieving event', error);
      if (error.message === 'Event not found') {
        return res.status(404).json(formatError(error.message, 404));
      }
      res.status(500).json(formatError(error.message, 500, error));
    }
  }

  static async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const { title, description, date, time, location, maxParticipants, status } = req.body;
      const organizerId = req.user.userId;

      const updatedEvent = EventService.updateEvent(
        id,
        { title, description, date, time, location, maxParticipants, status },
        organizerId
      );

      logger.info(`Event updated: ${id}`);

      res.json(
        formatResponse(updatedEvent, 'Event updated successfully')
      );
    } catch (error) {
      logger.error('Event update error', error);
      if (error.message === 'Event not found') {
        return res.status(404).json(formatError(error.message, 404));
      }
      if (error.message.includes('Unauthorized')) {
        return res.status(403).json(formatError(error.message, 403));
      }
      res.status(500).json(formatError(error.message, 500, error));
    }
  }

  static async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const organizerId = req.user.userId;

      const result = EventService.deleteEvent(id, organizerId);

      logger.info(`Event deleted: ${id}`);

      res.json(formatResponse(result, 'Event deleted successfully'));
    } catch (error) {
      logger.error('Event deletion error', error);
      if (error.message === 'Event not found') {
        return res.status(404).json(formatError(error.message, 404));
      }
      if (error.message.includes('Unauthorized')) {
        return res.status(403).json(formatError(error.message, 403));
      }
      res.status(500).json(formatError(error.message, 500, error));
    }
  }

  static async getUserOrganizedEvents(req, res) {
    try {
      const userId = req.user.userId;
      const events = EventService.getUserOrganizedEvents(userId);

      logger.info(`Retrieved organized events for user: ${userId}`);

      res.json(
        formatResponse(events, 'Organized events retrieved successfully')
      );
    } catch (error) {
      logger.error('Error retrieving organized events', error);
      res.status(500).json(formatError(error.message, 500, error));
    }
  }
}

module.exports = EventController;
