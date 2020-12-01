const route = require('express').Router()

const messageController = require('../controllers/message')

route.post('/message/:id', messageController.sendMsg)
route.get('/message/list', messageController.listMsg)

module.exports = route
