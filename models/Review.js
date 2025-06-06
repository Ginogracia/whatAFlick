const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
        trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        required: true,
        min: [0, 'Rating must be atleast 0.'],
        max: [10, 'Rating cannot exceed 10.']
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

    // _id from mongoDB is used for reviewId
})

//One review for one movie per user.
reviewSchema.index({ userId: 1, movieId: 1 }, { unique: true }); 

// Clean up
reviewSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v
        return ret
    }
})

module.exports = mongoose.model('Review', reviewSchema)