const express = require('express');
const { body, validationResult } = require('express-validator');
const Rating = require('../models/Rating');
const Store = require('../models/Store');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Submit or update rating
router.post('/submit', [
    auth,
    requireRole(['user']),
    body('storeId').isMongoId(),
    body('rating').isInt({ min: 1, max: 5 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { storeId, rating } = req.body;

        // Verify store exists
        const store = await Store.findById(storeId);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        // Check if user already rated this store
        let existingRating = await Rating.findOne({ user: req.user._id, store: storeId });

        if (existingRating) {
            // Update existing rating
            existingRating.rating = rating;
            existingRating.updatedAt = new Date();
            await existingRating.save();

            res.json({
                message: 'Rating updated successfully',
                rating: existingRating
            });
        } else {
            // Create new rating
            const newRating = new Rating({
                user: req.user._id,
                store: storeId,
                rating
            });

            await newRating.save();

            res.status(201).json({
                message: 'Rating submitted successfully',
                rating: newRating
            });
        }
    } catch (error) {
        console.error('Submit rating error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's rating for a specific store
router.get('/user-rating/:storeId', auth, requireRole(['user']), async (req, res) => {
    try {
        const rating = await Rating.findOne({
            user: req.user._id,
            store: req.params.storeId
        });

        res.json({ rating: rating ? rating.rating : null });
    } catch (error) {
        console.error('Get user rating error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete rating
router.delete('/:storeId', auth, requireRole(['user']), async (req, res) => {
    try {
        const rating = await Rating.findOneAndDelete({
            user: req.user._id,
            store: req.params.storeId
        });

        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        // Update store's average rating
        const store = await Store.findById(req.params.storeId);
        if (store) {
            await store.updateAverageRating();
        }

        res.json({ message: 'Rating deleted successfully' });
    } catch (error) {
        console.error('Delete rating error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;