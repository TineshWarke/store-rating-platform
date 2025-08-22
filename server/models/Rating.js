const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure one rating per user per store
ratingSchema.index({ user: 1, store: 1 }, { unique: true });

// Update store's average rating after saving
ratingSchema.post('save', async function () {
    const Store = require('./Store');
    const store = await Store.findById(this.store);
    if (store) {
        await store.updateAverageRating();
    }
});

// Update store's average rating after removing
ratingSchema.post('remove', async function () {
    const Store = require('./Store');
    const store = await Store.findById(this.store);
    if (store) {
        await store.updateAverageRating();
    }
});

module.exports = mongoose.model('Rating', ratingSchema);