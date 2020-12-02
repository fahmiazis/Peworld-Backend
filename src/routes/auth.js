const route = require('express').Router()
const authController = require('../controllers/auth')

route.post('/register/:role', authController.register)
route.post('/login/:role', authController.login)
route.post('/refreshToken', authController.refreshToken)

route.patch('/reset-password', authController.resetPassword)

module.exports = route
