const route = require('express').Router()
const skill = require('../controllers/skills')
const portofolio = require('../controllers/portofolio')

route.post('/skill/post', skill.postSkill)
route.get('/skill/get', skill.getSkills)
route.patch('/skill/update/:id', skill.updateSkill)
route.delete('/skill/delete/:id', skill.deleteSkill)

route.post('/portofolio', portofolio.postPortofolio)
route.post('/portofolio/image/:id', portofolio.uploadPicturePortofolio)
route.get('/portofolio', portofolio.getAllPortofolio)
route.get('/portofolio/:id', portofolio.getDetailPortofolio)
route.patch('/portofolio/:id', portofolio.updatePortofolio)
route.delete('/portofolio/:id', portofolio.deletePortofolio)

module.exports = route
