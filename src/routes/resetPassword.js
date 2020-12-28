const route = require('express').Router()

const resetPassword = require('../controllers/resetPassword')
route.post('/account/send', resetPassword.sendResetCode) // send reset code to email
route.post('/account/match', resetPassword.matchResetCode) // matching reset code
route.post('/account/password', resetPassword.resetPassword) // reset password

module.exports = route
