const route = require('express').Router()
const jobSeek = require('../controllers/company')

route.get('/job-seeker/all', jobSeek.getUsers)
route.get('/job-seeker/:id', jobSeek.getDetailUser)

const messageController = require('../controllers/message')

route.post('/message/:id', messageController.sendMsg)
route.get('/message/list', messageController.listMsg)
route.get('/message/:id', messageController.listChat)

module.exports = route
