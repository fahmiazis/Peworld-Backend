const route = require('express').Router()

const messageController = require('../controllers/message')

route.post('/message/:id', messageController.sendMsg)

module.exports = route
