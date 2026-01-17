const EventModel = require('../models/eventModel');
const UserModel = require('../models/user');
const logger = require('../utils/logger');

class EventService {
  static async createEvent(eventData, organizerId) {
    try {
      if (!eventData.title || !eventData.date || !eventData.time) {
        throw new Error('Title, date, and time are required');
      }

      const event = await EventModel.create({
        ...eventData,
        organizerId,
      });
      logger.info(`Event created: ${event._id}`);
      return event;
    } catch (error) {
      logger.error('Error creating event', error);
      throw error;
    }
  }

  static async updateEvent(eventId, updateData, organizerId) {
    try {
      const event = await EventModel.findById(eventId);

      if (!event) {
        throw new Error('Event not found');
      }

      if (event.organizerId.toString() !== organizerId) {
        throw new Error('Unauthorized: Only event organizer can update');
      }

      const updatedEvent = await EventModel.findByIdAndUpdate(
        eventId,
        updateData,
        { new: true }
      );
      logger.info(`Event updated: ${eventId}`);
      return updatedEvent;
    } catch (error) {
      logger.error('Error updating event', error);
      throw error;
    }
  }

  static async deleteEvent(eventId, organizerId) {
    try {
      const event = await EventModel.findById(eventId);

      if (!event) {
        throw new Error('Event not found');
      }

      if (event.organizerId.toString() !== organizerId) {
        throw new Error('Unauthorized: Only event organizer can delete');
      }

      await EventModel.findByIdAndDelete(eventId);
      logger.info(`Event deleted: ${eventId}`);
      return { success: true, message: 'Event deleted successfully' };
    } catch (error) {
      logger.error('Error deleting event', error);
      throw error;
    }
  }

  static async getEventDetails(eventId) {
    try {
      const Participant = require('../models/participant');
      
      const event = await EventModel.findById(eventId).populate({
        path: 'organizerId',
        select: 'name email role',
      });

      if (!event) {
        throw new Error('Event not found');
      }

      // Get participant details from Participant collection
      const participants = await Participant.find({ eventId }).populate({
        path: 'userId',
        select: 'name email role',
      });

      const participantDetails = participants.map((p) => ({
        id: p.userId._id,
        name: p.userId.name,
        email: p.userId.email,
        status: p.status,
      }));

      return {
        ...event.toObject(),
        organizer: {
          id: event.organizerId._id,
          name: event.organizerId.name,
          email: event.organizerId.email,
        },
        participantDetails,
      };
    } catch (error) {
      logger.error('Error getting event details', error);
      throw error;
    }
  }

  static async getUserRegisteredEvents(userId) {
    try {
      const Participant = require('../models/participant');
      
      const participants = await Participant.find({ userId }).populate('eventId');
      const events = participants.map((p) => p.eventId);

      return events;
    } catch (error) {
      logger.error('Error getting user registered events', error);
      throw error;
    }
  }

  static async getUserOrganizedEvents(userId) {
    try {
      return await EventModel.findByOrganizerId(userId);
    } catch (error) {
      logger.error('Error getting user organized events', error);
      throw error;
    }
  }
}

module.exports = EventService;
