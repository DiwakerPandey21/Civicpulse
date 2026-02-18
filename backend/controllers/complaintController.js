const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Citizen)
const createComplaint = async (req, res) => {
    const { title, description, category, severity, location } = req.body;

    try {
        const complaint = new Complaint({
            title,
            description,
            category,
            severity,
            location: location ? JSON.parse(location) : {},
            media: req.file ? req.file.path : null, // Handle file upload
            createdBy: req.user._id,
        });

        // Auto-assign department based on category logic could go here
        // For now, it stays unassigned or assigned to a default official if implemented

        const createdComplaint = await complaint.save();

        // AWARD POINTS: +10 for reporting an issue
        await User.findByIdAndUpdate(req.user._id, { $inc: { points: 10 } });

        res.status(201).json(createdComplaint);
    } catch (error) {
        console.error("Error creating complaint:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get complaints
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
    try {
        let complaints;
        if (req.user.role === 'citizen') {
            complaints = await Complaint.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
        } else if (req.user.role === 'official') {
            // Officials see complaints relevant to their department
            if (req.user.department && req.user.department !== 'None') {
                // Mapping Logic: Category -> Department
                // 'Traffic Violation' -> 'Traffic'
                // 'Pothole' -> 'infrastructure'
                // 'Water Leak' -> 'Water'
                // 'Garbage' -> 'health' (assuming)
                // 'Street Light' -> 'infrastructure'

                // This mapping should be more robust, maybe a helper function.
                // For simplicity, let's filter purely by categories that match their department.

                let categories = [];
                if (req.user.department === 'Traffic') categories = ['Traffic Violation'];
                if (req.user.department === 'infrastructure') categories = ['Pothole', 'Street Light'];
                if (req.user.department === 'Water') categories = ['Water Leak'];
                if (req.user.department === 'health') categories = ['Garbage'];

                complaints = await Complaint.find({ category: { $in: categories } }).sort({ createdAt: -1 });

            } else {
                // If no department assigned, maybe they see nothing or all? Let's say nothing for now.
                complaints = [];
            }

        } else if (req.user.role === 'admin') {
            complaints = await Complaint.find({}).populate('createdBy', 'name email').sort({ createdAt: -1 });
        }

        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');

// ... existing imports

// @desc    Update complaint status
// @route   PATCH /api/complaints/:id/status
// @access  Private (Official/Admin)
// @desc    Update complaint status
// @route   PATCH /api/complaints/:id/status
// @access  Private (Official/Admin)
const updateComplaintStatus = async (req, res) => {
    const { status, resolutionNote } = req.body;

    try {
        const complaint = await Complaint.findById(req.params.id).populate('createdBy');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        const oldStatus = complaint.status;
        complaint.status = status || complaint.status;
        complaint.resolutionNote = resolutionNote || complaint.resolutionNote;

        // Handle Resolution Evidence
        if (status === 'Resolved') {
            if (req.file) {
                complaint.resolutionImage = req.file.path;
            } else if (!complaint.resolutionImage) {
                // If resolving and no image is uploaded (and none exists), this might be a policy violation
                // But for now, let's allow it or handle gracefully if not strict. 
                // However, frontend enforces it. Backend should be safe.
                // Assuming we want to allow resolution without new image if one already exists? 
                // Or if it came from a different path.
            }
            complaint.resolutionDate = Date.now();
        }

        if (req.user.role === 'official') {
            complaint.assignedTo = req.user._id;
        }

        const updatedComplaint = await complaint.save();

        // SEND NOTIFICATIONS (Async - don't block response)
        const sendNotifications = async () => {
            if (status && status !== oldStatus) {
                const message = `Your complaint "${complaint.title}" status has been updated to: ${status.toUpperCase()}.\n\nNote: ${resolutionNote || 'No additional notes.'}`;

                // Email
                if (complaint.createdBy && complaint.createdBy.email) {
                    try {
                        await sendEmail({
                            email: complaint.createdBy.email,
                            subject: 'Complaint Status Update - CivicPulse',
                            message
                        });
                    } catch (err) {
                        console.error("Email failed:", err.message);
                    }
                }

                // SMS
                if (complaint.createdBy && complaint.createdBy.phone) {
                    try {
                        await sendSMS({
                            phone: complaint.createdBy.phone,
                            message: `CivicPulse Update: Your complaint ID ${complaint._id.toString().substr(-6).toUpperCase()} is now ${status.toUpperCase()}.`
                        });
                    } catch (err) {
                        console.error("SMS failed:", err.message);
                    }
                }
            }
        };

        sendNotifications(); // Fire and forget

        res.json(updatedComplaint);

    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id).populate('createdBy', 'name email');

        if (complaint) {
            res.json(complaint);
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createComplaint, getComplaints, updateComplaintStatus, getComplaintById };
