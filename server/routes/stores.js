const express = require('express');
const { body, validationResult } = require('express-validator');
const Store = require('../models/Store');
const User = require('../models/User');
const Rating = require('../models/Rating');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create new store (admin only)
router.post('/create', [
    auth,
    requireRole(['admin']),
    body('name').isLength({ min: 20, max: 60 }).trim(),
    body('email').isEmail().normalizeEmail(),
    body('address').isLength({ max: 400 }).trim(),
    body('ownerId').isMongoId()
], async (req, res) => {
    try {
        console.log(req)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, address, ownerId } = req.body;

        // Check if store already exists
        const existingStore = await Store.findOne({ email });
        if (existingStore) {
            return res.status(400).json({ message: 'Store already exists with this email' });
        }

        // Verify owner exists and is a store owner
        const owner = await User.findById(ownerId);
        if (!owner || owner.role !== 'storeOwner') {
            return res.status(400).json({ message: 'Invalid store owner' });
        }

        // Check if owner already has a store
        const existingOwnerStore = await Store.findOne({ owner: ownerId });
        if (existingOwnerStore) {
            return res.status(400).json({ message: 'This user already owns a store' });
        }

        const store = new Store({
            name,
            email,
            address,
            owner: ownerId
        });

        await store.save();
        await store.populate('owner', 'name email');

        res.status(201).json({
            message: 'Store created successfully',
            store
        });
    } catch (error) {
        console.error('Store creation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all stores with filtering and sorting
router.get('/all', auth, async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            sortBy = 'name',
            sortOrder = 'asc',
            page = 1,
            limit = 10
        } = req.query;

        // Build filter object
        const filter = {};
        if (name) filter.name = new RegExp(name, 'i');
        if (email) filter.email = new RegExp(email, 'i');
        if (address) filter.address = new RegExp(address, 'i');

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        let stores = await Store.find(filter)
            .populate('owner', 'name email')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // For normal users, include their ratings
        if (req.user.role === 'user') {
            const userRatings = await Rating.find({ user: req.user._id });
            const ratingsMap = userRatings.reduce((acc, rating) => {
                acc[rating.store.toString()] = rating.rating;
                return acc;
            }, {});

            stores = stores.map(store => ({
                ...store.toObject(),
                userRating: ratingsMap[store._id.toString()] || null
            }));
        }

        const total = await Store.countDocuments(filter);

        res.json({
            stores,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total
            }
        });
    } catch (error) {
        console.error('Get stores error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get store owner's dashboard data
router.get('/owner-dashboard', auth, requireRole(['storeOwner']), async (req, res) => {
    try {
        const store = await Store.findOne({ owner: req.user._id });

        if (!store) {
            return res.status(404).json({ message: 'Store not found for this owner' });
        }

        // Get all ratings for this store with user details
        const ratings = await Rating.find({ store: store._id })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            store: {
                id: store._id,
                name: store.name,
                averageRating: store.averageRating,
                totalRatings: store.totalRatings
            },
            ratings
        });
    } catch (error) {
        console.error('Owner dashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;