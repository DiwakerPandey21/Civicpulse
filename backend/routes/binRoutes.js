const express = require('express');
const router = express.Router();
const { getBins, emptyBin } = require('../controllers/binController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getBins);
router.put('/:id/empty', protect, emptyBin);

module.exports = router;
