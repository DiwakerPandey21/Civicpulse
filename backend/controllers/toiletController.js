const Toilet = require('../models/Toilet');

// @desc    Add a new toilet (Admin/Official only)
// @route   POST /api/toilets
// @access  Private/Admin
const addToilet = async (req, res) => {
    try {
        const { name, address, lat, lng, facilities, status } = req.body;

        const toilet = await Toilet.create({
            name,
            address,
            location: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            facilities,
            status,
            addedBy: req.user._id
        });

        res.status(201).json(toilet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get toilets (nearby or all)
// @route   GET /api/toilets
// @access  Public
const getToilets = async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;

        // If lat/lng provided, find nearby
        if (lat && lng) {
            const maxDistance = radius ? parseInt(radius) * 1000 : 5000; // Default 5km

            const toilets = await Toilet.find({
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(lng), parseFloat(lat)]
                        },
                        $maxDistance: maxDistance
                    }
                }
            });

            res.json(toilets);
        } else {
            // Otherwise return all (limit to 50 to be safe)
            const toilets = await Toilet.find({}).limit(50);
            res.json(toilets);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addToilet, getToilets };
