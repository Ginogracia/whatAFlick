const express = require('express')
const router = express.Router()

const validateInput = require('../middleware/validateInput')
const authenticateLogin = require('../middleware/authenticateLogin')
const generateToken = require('../utility/generateToken')


router.post('/', validateInput, authenticateLogin, async (req, res) => {

    const token = generateToken(req.user)
    res.json({ message: `Welcome ${req.user.name}!`, token })

})

module.exports = router