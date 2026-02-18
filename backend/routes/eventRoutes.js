const express = require('express');
const router = express.Router();
const { createEvent, getEvents, joinEvent } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getEvents)
    .post(protect, authorize('admin', 'official'), createEvent);

router.route('/:id/join')
    .post(protect, joinEvent);

module.exports = router;
