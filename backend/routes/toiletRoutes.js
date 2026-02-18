const express = require('express');
const router = express.Router();
const { addToilet, getToilets } = require('../controllers/toiletController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getToilets)
    .post(protect, addToilet); // Only logged in users can add (can enforce role later)

module.exports = router;
