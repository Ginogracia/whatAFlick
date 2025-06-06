const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    director: {
        type: [String],
        required: true,
        trim: true,
    },
    releaseYear: {
        type: Number,
        required: true,
    },
    genre: {
        type: [String],
        required: true,
        validate: [arr => arr.length > 0, 'At least  one genre is required.']
    },

    // _id from mongoDB is used for movieId
})


// Clean up
movieSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v
        return ret
    }
})

module.exports = mongoose.model('Movie', movieSchema)