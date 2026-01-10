const express = require('express');
const ParticipantController = require('../controllers/participantController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes below require authentication
router.use(authMiddleware);

// POST /api/events/:eventId/register - Register for an event
router.post('/:eventId/register', ParticipantController.registerForEvent);

// DELETE /api/events/:eventId/register - Unregister from an event
router.delete('/:eventId/register', ParticipantController.unregisterFromEvent);

// GET /api/events/:eventId/participants - Get participants of an event
router.get('/:eventId/participants', ParticipantController.getEventParticipants);

// GET /api/events/my/registered - Get events the user is registered for
router.get('/my/registered', ParticipantController.getUserRegisteredEvents);

module.exports = router;
