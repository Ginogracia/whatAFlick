const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Rater'],
        default: 'Rater',
    }

    // _id from mongoDB is used for userId
})

// Clean up
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v
        delete ret.password 
        return ret
    }
})

module.exports = mongoose.model('User', userSchema)