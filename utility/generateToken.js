const jwt = require('jsonwebtoken')

function generateToken(user) {
    return jwt.sign(
        { userId: user._id, name: user.name, role: user.role},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    )
}

module.exports = generateToken