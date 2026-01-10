const request = require('supertest');
const app = require('../src/server');

describe('Authentication Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
          name: 'Test User',
          role: 'attendee',
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data.userId).toBeDefined();
    });

    it('should fail with missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@example.com',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain('required');
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalidemail',
          password: 'password123',
          name: 'Test User',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain('email');
    });

    it('should fail with weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@example.com',
          password: '123',
          name: 'Test User',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain('password');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      // First register a user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'logintest@example.com',
          password: 'password123',
          name: 'Login Test',
          role: 'attendee',
        });

      // Then login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'password123',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.userId).toBeDefined();
      expect(response.body.message).toBe('Login successful');
    });

    it('should fail with wrong password', async () => {
      // First register a user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'wrongpasstest@example.com',
          password: 'password123',
          name: 'Wrong Pass Test',
        });

      // Try login with wrong password
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrongpasstest@example.com',
          password: 'wrongpassword',
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toContain('Invalid');
    });

    it('should fail with non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toContain('Invalid');
    });
  });
});
