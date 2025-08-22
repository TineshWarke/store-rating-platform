const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics (admin only)
router.get('/dashboard-stats', auth, requireRole(['admin']), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStores = await Store.countDocuments();
        const totalRatings = await Rating.countDocuments();

        res.json({
            totalUsers,
            totalStores,
            totalRatings
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new user (admin only)
router.post('/create', [
    auth,
    requireRole(['admin']),
    body('name').isLength({ min: 20, max: 60 }).trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8, max: 16 }).matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/),
    body('address').isLength({ max: 400 }).trim(),
    body('role').isIn(['admin', 'user', 'storeOwner'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, address, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = new User({
            name,
            email,
            password,
            address,
            role
        });

        await user.save();

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role
            }
        });
    } catch (error) {
        console.error('User creation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all users with filtering and sorting (admin only)
router.get('/all', auth, requireRole(['admin']), async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            role,
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
        if (role) filter.role = role;

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const users = await User.find(filter)
            .select('-password')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(filter);

        res.json({
            users,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user details (admin only)
router.get('/details/:id', auth, requireRole(['admin']), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let rating = null;
        if (user.role === 'storeOwner') {
            const store = await Store.findOne({ owner: user._id });
            if (store) {
                rating = store.averageRating;
            }
        }

        res.json({
            ...user.toObject(),
            rating
        });
    } catch (error) {
        console.error('Get user details error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/store-owners', auth, requireRole(['admin']), async (req, res) => {
    try {
        const owners = await User.find({ role: 'storeOwner' }).select('_id name email');
        res.json(owners);
    } catch (error) {
        console.error('Error fetching store owners:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;