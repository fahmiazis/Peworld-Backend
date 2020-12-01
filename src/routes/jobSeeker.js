const route = require('express').Router()
const skill = require('../controllers/skills')

route.post('/skill/post', skill.postSkill)
route.get('/skill/get', skill.getSkills)
route.patch('/skill/update/:id', skill.updateSkill)
route.delete('/skill/delete/:id', skill.deleteSkill)

const messageController = require('../controllers/message')

route.post('/message/:id', messageController.sendMsg)
route.get('/message/list', messageController.listMsg)
route.get('/message/:id', messageController.listChat)

module.exports = route
