const route = require('express').Router()

const messageController = require('../controllers/message')

route.post('/message/:id', messageController.sendMsg)
route.get('/message/list', messageController.listMsg)
route.get('/message/:id', messageController.listChat)

module.exports = route
