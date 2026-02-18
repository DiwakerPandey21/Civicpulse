const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, updateComplaintStatus, getComplaintById, dispatchComplaint } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const roleCheck = require('../middleware/roleMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer
const storage = multer.diskStorage({
    destination(req, file, cb) {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

const upload = multer({ storage });

router.route('/')
    .post(protect, roleCheck(['citizen']), upload.single('media'), createComplaint)
    .get(protect, getComplaints);

router.route('/:id')
    .get(protect, getComplaintById);


router.route('/:id/status').patch(protect, roleCheck(['official', 'admin']), upload.single('resolutionImage'), updateComplaintStatus);

router.route('/:id/dispatch').put(protect, roleCheck(['official', 'admin']), dispatchComplaint);

module.exports = router;
