const express = require('express');
const EventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateCreateEvent } = require('../middleware/validator');

const router = express.Router();

// All routes below require authentication
router.use(authMiddleware);

// POST /api/events - Create a new event (organizers only)
router.post('/', validateCreateEvent, EventController.createEvent);

// GET /api/events - Get all events
router.get('/', EventController.getAllEvents);

// GET /api/events/:id - Get a specific event
router.get('/:id', EventController.getEventById);

// PUT /api/events/:id - Update an event (organizer only)
router.put('/:id', EventController.updateEvent);

// DELETE /api/events/:id - Delete an event (organizer only)
router.delete('/:id', EventController.deleteEvent);

// GET /api/events/my/organized - Get events organized by the user
router.get('/my/organized', EventController.getUserOrganizedEvents);

module.exports = router;
