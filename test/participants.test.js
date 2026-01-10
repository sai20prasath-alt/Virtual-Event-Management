const request = require('supertest');
const app = require('../src/server');

describe('Participant Routes', () => {
  let attendeeToken;
  let attendeeId;
  let organizerToken;
  let eventId;

  beforeAll(async () => {
    // Register an attendee
    const attendeeRegister = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'attendee@example.com',
        password: 'password123',
        name: 'Test Attendee',
        role: 'attendee',
      });

    attendeeId = attendeeRegister.body.data.userId;

    // Login attendee to get token
    const attendeeLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'attendee@example.com',
        password: 'password123',
      });

    attendeeToken = attendeeLogin.body.data.token;

    // Register an organizer
    const organizerRegister = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'organizer2@example.com',
        password: 'password123',
        name: 'Test Organizer',
        role: 'organizer',
      });

    // Login organizer to get token
    const organizerLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'organizer2@example.com',
        password: 'password123',
      });

    organizerToken = organizerLogin.body.data.token;

    // Create an event
    const eventResponse = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({
        title: 'Test Event',
        description: 'Event for participant testing',
        date: '2024-08-15',
        time: '15:00',
        maxParticipants: 50,
      });

    eventId = eventResponse.body.data.id;
  });

  describe('POST /api/events/:eventId/register', () => {
    it('should register user for an event', async () => {
      const response = await request(app)
        .post(`/api/events/${eventId}/register`)
        .set('Authorization', `Bearer ${attendeeToken}`);

      expect(response.statusCode).toBe(201);
      expect(response.body.data.eventId).toBe(eventId);
      expect(response.body.data.userId).toBe(attendeeId);
    });

    it('should prevent duplicate registration', async () => {
      const response = await request(app)
        .post(`/api/events/${eventId}/register`)
        .set('Authorization', `Bearer ${attendeeToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain('already registered');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post(`/api/events/${eventId}/register`);

      expect(response.statusCode).toBe(401);
    });

    it('should fail for non-existent event', async () => {
      const response = await request(app)
        .post('/api/events/nonexistent/register')
        .set('Authorization', `Bearer ${attendeeToken}`);

      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/events/:eventId/register', () => {
    it('should unregister user from an event', async () => {
      // First register for an event
      const newEventResponse = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({
          title: 'Event to Unregister',
          date: '2024-09-15',
          time: '16:00',
        });

      const newEventId = newEventResponse.body.data.id;

      await request(app)
        .post(`/api/events/${newEventId}/register`)
        .set('Authorization', `Bearer ${attendeeToken}`);

      // Then unregister
      const response = await request(app)
        .delete(`/api/events/${newEventId}/register`)
        .set('Authorization', `Bearer ${attendeeToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.eventId).toBe(newEventId);
    });

    it('should fail if user not registered', async () => {
      const response = await request(app)
        .delete(`/api/events/${eventId}/register`)
        .set('Authorization', `Bearer ${organizerToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain('not registered');
    });
  });

  describe('GET /api/events/:eventId/participants', () => {
    it('should get all participants of an event', async () => {
      const response = await request(app)
        .get(`/api/events/${eventId}/participants`)
        .set('Authorization', `Bearer ${organizerToken}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body.data.participants)).toBe(true);
    });

    it('should return 404 for non-existent event', async () => {
      const response = await request(app)
        .get('/api/events/nonexistent/participants')
        .set('Authorization', `Bearer ${attendeeToken}`);

      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /api/events/my/registered', () => {
    it('should get user registered events', async () => {
      const response = await request(app)
        .get('/api/events/my/registered')
        .set('Authorization', `Bearer ${attendeeToken}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
