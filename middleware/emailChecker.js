const User = require('../models/User')

module.exports = async function emailChecker(req, res, next) {
    const existingemail = await User.findOne({ name: req.body.email })
    if (existingEmail) {
        return res.status(400).json({ message: 'Email is already in use.' })
    }
    next()
}