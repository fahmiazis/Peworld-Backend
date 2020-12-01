const route = require('express').Router()
const skill = require('../controllers/skills')
const portofolio = require('../controllers/portofolio')
const messageController = require('../controllers/message')

route.post('/skill/post', skill.postSkill)
route.get('/skill/get', skill.getSkills)
route.patch('/skill/update/:id', skill.updateSkill)
route.delete('/skill/delete/:id', skill.deleteSkill)

route.post('/message/:id', messageController.sendMsg)
route.get('/message/list', messageController.listMsg)
route.get('/message/:id', messageController.listChat)

route.post('/portofolio', portofolio.postPortofolio)
route.post('/portofolio/image/:id', portofolio.uploadPicturePortofolio)
route.get('/portofolio', portofolio.getAllPortofolio)
route.get('/portofolio/:id', portofolio.getDetailPortofolio)
route.patch('/portofolio/:id', portofolio.updatePortofolio)
route.delete('/portofolio/:id', portofolio.deletePortofolio)

module.exports = route
