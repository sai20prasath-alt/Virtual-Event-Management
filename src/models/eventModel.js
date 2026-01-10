const { generateUUID } = require('../utils/idGenerator');

const events = [];

class EventModel {
  static create(eventData, organizerId) {
    const newEvent = {
      id: generateUUID(),
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location || 'Virtual',
      organizerId,
      participants: [],
      maxParticipants: eventData.maxParticipants || null,
      status: 'scheduled', // 'scheduled', 'ongoing', 'completed', 'cancelled'
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    events.push(newEvent);
    return newEvent;
  }

  static findById(id) {
    return events.find((e) => e.id === id);
  }

  static getAll() {
    return events;
  }

  static getByOrganizerId(organizerId) {
    return events.filter((e) => e.organizerId === organizerId);
  }

  static update(id, updateData) {
    const event = this.findById(id);
    if (event) {
      Object.assign(event, updateData, { updatedAt: new Date() });
    }
    return event;
  }

  static delete(id) {
    const index = events.findIndex((e) => e.id === id);
    if (index > -1) {
      events.splice(index, 1);
      return true;
    }
    return false;
  }

  static addParticipant(eventId, userId) {
    const event = this.findById(eventId);
    if (event) {
      if (!event.participants.includes(userId)) {
        // Check max participants
        if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
          return null; // Event is full
        }
        event.participants.push(userId);
        event.updatedAt = new Date();
      }
    }
    return event;
  }

  static removeParticipant(eventId, userId) {
    const event = this.findById(eventId);
    if (event) {
      const index = event.participants.indexOf(userId);
      if (index > -1) {
        event.participants.splice(index, 1);
        event.updatedAt = new Date();
      }
    }
    return event;
  }

  static isParticipant(eventId, userId) {
    const event = this.findById(eventId);
    return event ? event.participants.includes(userId) : false;
  }

  static getParticipantCount(eventId) {
    const event = this.findById(eventId);
    return event ? event.participants.length : 0;
  }
}

module.exports = EventModel;
