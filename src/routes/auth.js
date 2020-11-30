const route = require('express').Router()
const authController = require('../controllers/auth')

route.post('/register/:role', authController.register)

module.exports = route
