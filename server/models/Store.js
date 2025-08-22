const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 60,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    address: {
        type: String,
        required: true,
        maxlength: 400,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Update average rating when ratings change
storeSchema.methods.updateAverageRating = async function () {
    const Rating = require('./Rating');
    const ratings = await Rating.find({ store: this._id });

    if (ratings.length === 0) {
        this.averageRating = 0;
        this.totalRatings = 0;
    } else {
        const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
        this.averageRating = Math.round((sum / ratings.length) * 10) / 10;
        this.totalRatings = ratings.length;
    }

    await this.save();
};

module.exports = mongoose.model('Store', storeSchema);