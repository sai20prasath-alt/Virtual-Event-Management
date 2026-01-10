const request = require('supertest');
const app = require('../src/server');

describe('Event Routes', () => {
  let authToken;
  let organizerId;
  let eventId;

  beforeAll(async () => {
    // Register an organizer
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'organizer@example.com',
        password: 'password123',
        name: 'Event Organizer',
        role: 'organizer',
      });

    organizerId = registerResponse.body.data.userId;

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'organizer@example.com',
        password: 'password123',
      });

    authToken = loginResponse.body.data.token;
  });

  describe('POST /api/events', () => {
    it('should create a new event as organizer', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Tech Conference 2024',
          description: 'A conference about latest technologies',
          date: '2024-06-15',
          time: '10:00',
          location: 'New York',
          maxParticipants: 100,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.data.title).toBe('Tech Conference 2024');
      expect(response.body.data.organizerId).toBe(organizerId);
      eventId = response.body.data.id;
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/events')
        .send({
          title: 'Unauthorized Event',
          date: '2024-06-15',
          time: '10:00',
        });

      expect(response.statusCode).toBe(401);
    });

    it('should fail with missing required fields', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Incomplete Event',
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/events', () => {
    it('should get all events', async () => {
      const response = await request(app)
        .get('/api/events')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/events/:id', () => {
    it('should get a specific event by ID', async () => {
      if (!eventId) return; // Skip if event wasn't created

      const response = await request(app)
        .get(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.title).toBe('Tech Conference 2024');
    });

    it('should return 404 for non-existent event', async () => {
      const response = await request(app)
        .get('/api/events/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /api/events/:id', () => {
    it('should update an event as organizer', async () => {
      if (!eventId) return; // Skip if event wasn't created

      const response = await request(app)
        .put(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Tech Conference 2024',
          description: 'Updated description',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.data.title).toBe('Updated Tech Conference 2024');
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete an event as organizer', async () => {
      // Create a new event to delete
      const createResponse = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Event to Delete',
          date: '2024-07-15',
          time: '14:00',
        });

      const eventToDeleteId = createResponse.body.data.id;

      const response = await request(app)
        .delete(`/api/events/${eventToDeleteId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.success).toBe(true);
    });
  });
});
