const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Official/Admin)
const createEvent = async (req, res) => {
    const { title, description, type, date, location } = req.body;

    try {
        const event = new Event({
            title,
            description,
            type,
            date,
            location,
            createdBy: req.user._id,
        });

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
    try {
        const events = await Event.find({})
            .populate('createdBy', 'name department')
            .sort({ date: 1 }); // Sort by date ascending (soonest first)
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Join an event
// @route   POST /api/events/:id/join
// @access  Private (Citizen)
const joinEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if already joined
        if (event.attendees.includes(req.user._id)) {
            return res.status(400).json({ message: 'You have already joined this event' });
        }

        event.attendees.push(req.user._id);
        await event.save();

        // AWARD POINTS: +2 Points for joining an event (Community Participation)
        await User.findByIdAndUpdate(req.user._id, { $inc: { points: 2 } });

        res.json({ message: 'Event joined successfully', event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createEvent, getEvents, joinEvent };
