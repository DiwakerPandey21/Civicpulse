const Message = require('../models/Message');
const Complaint = require('../models/Complaint');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    const { complaintId, content } = req.body;

    try {
        const complaint = await Complaint.findById(complaintId);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Verify user is involved (either the creator or the assigned official/admin)
        // For simplicity, we allow any logged in user to comment for now, or you can restrict:
        // if (req.user._id.toString() !== complaint.user.toString() && req.user.role === 'citizen') {
        //     return res.status(401).json({ message: 'Not authorized' });
        // }

        const message = new Message({
            complaint: complaintId,
            sender: req.user._id,
            content,
        });

        const createdMessage = await message.save();

        // Populate sender details for immediate frontend display
        await createdMessage.populate('sender', 'name role');

        res.status(201).json(createdMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get messages for a complaint
// @route   GET /api/messages/:complaintId
// @access  Private
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ complaint: req.params.complaintId })
            .populate('sender', 'name role')
            .sort({ createdAt: 1 }); // Oldest first

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { sendMessage, getMessages };
