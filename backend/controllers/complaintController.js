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
                let categories = [];

                // Department Mapping
                switch (req.user.department) {
                    case 'Health':
                        categories = ['Dead animal(s)', 'Garbage dump', 'Dustbins not cleaned', 'Sweeping not done'];
                        break;
                    case 'Sanitation':
                        categories = ['Garbage dump', 'Overflow of Sewerage or Storm Water', 'Yellow Spot (Public Urination Spot)', 'Garbage vehicle not arrived'];
                        break;
                    case 'Infrastructure':
                        categories = ['Pothole', 'Street Light', 'No electricity in public toilet(s)', 'Water Leak']; // Water leak often falls here or separate
                        break;
                    case 'Traffic':
                        categories = ['Traffic Violation'];
                        break;
                    case 'Water':
                        categories = ['Water Leak', 'Overflow of Sewerage or Storm Water'];
                        break;
                    default:
                        categories = [];
                }

                // If categories defined, filter by them
                if (categories.length > 0) {
                    complaints = await Complaint.find({ category: { $in: categories } }).sort({ createdAt: -1 });
                } else {
                    // Fallback: If dept exists but no mapping (e.g., 'General'), maybe show all or none?
                    // Let's show none to force proper assignment, or all if it's 'General Admin'
                    complaints = [];
                }

            } else {
                // If official has no department, they see nothing (or maybe they should see Unassigned?)
                // For now, return empty to encourage meaningful assignment.
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

// @desc    Dispatch Vehicle for Complaint
// @route   PUT /api/complaints/:id/dispatch
// @access  Private (Official/Admin)
const dispatchComplaint = async (req, res) => {
    try {
        const { vehicleNumber, driverName } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (complaint) {
            complaint.vehicleNumber = vehicleNumber;
            complaint.driverName = driverName;
            complaint.dispatchTime = Date.now();
            complaint.status = 'In Progress';

            const updatedComplaint = await complaint.save();
            res.json(updatedComplaint);
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteComplaint = async (req, res) => { /* Dummy for consistency if missing */ };

module.exports = { createComplaint, getComplaints, updateComplaintStatus, getComplaintById, dispatchComplaint };
