const EventModel = require('../models/eventModel');
const UserModel = require('../models/userModel');
const logger = require('../utils/logger');

class EventService {
  static createEvent(eventData, organizerId) {
    try {
      if (!eventData.title || !eventData.date || !eventData.time) {
        throw new Error('Title, date, and time are required');
      }

      const event = EventModel.create(eventData, organizerId);
      logger.info(`Event created: ${event.id}`);
      return event;
    } catch (error) {
      logger.error('Error creating event', error);
      throw error;
    }
  }

  static updateEvent(eventId, updateData, organizerId) {
    try {
      const event = EventModel.findById(eventId);

      if (!event) {
        throw new Error('Event not found');
      }

      if (event.organizerId !== organizerId) {
        throw new Error('Unauthorized: Only event organizer can update');
      }

      const updatedEvent = EventModel.update(eventId, updateData);
      logger.info(`Event updated: ${eventId}`);
      return updatedEvent;
    } catch (error) {
      logger.error('Error updating event', error);
      throw error;
    }
  }

  static deleteEvent(eventId, organizerId) {
    try {
      const event = EventModel.findById(eventId);

      if (!event) {
        throw new Error('Event not found');
      }

      if (event.organizerId !== organizerId) {
        throw new Error('Unauthorized: Only event organizer can delete');
      }

      EventModel.delete(eventId);
      logger.info(`Event deleted: ${eventId}`);
      return { success: true, message: 'Event deleted successfully' };
    } catch (error) {
      logger.error('Error deleting event', error);
      throw error;
    }
  }

  static getEventDetails(eventId) {
    try {
      const event = EventModel.findById(eventId);

      if (!event) {
        throw new Error('Event not found');
      }

      // Enrich with organizer details
      const organizer = UserModel.findById(event.organizerId);
      const participantDetails = event.participants.map((userId) => {
        const user = UserModel.findById(userId);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      });

      return {
        ...event,
        organizer: {
          id: organizer.id,
          name: organizer.name,
          email: organizer.email,
        },
        participantDetails,
      };
    } catch (error) {
      logger.error('Error getting event details', error);
      throw error;
    }
  }

  static getUserRegisteredEvents(userId) {
    try {
      const allEvents = EventModel.getAll();
      const userEvents = allEvents.filter((event) =>
        event.participants.includes(userId)
      );

      return userEvents;
    } catch (error) {
      logger.error('Error getting user registered events', error);
      throw error;
    }
  }

  static getUserOrganizedEvents(userId) {
    try {
      return EventModel.getByOrganizerId(userId);
    } catch (error) {
      logger.error('Error getting user organized events', error);
      throw error;
    }
  }
}

module.exports = EventService;
