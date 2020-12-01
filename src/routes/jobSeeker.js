const route = require('express').Router()
const skill = require('../controllers/skills')

route.post('/skill/post', skill.postSkill)
route.get('/skill/get', skill.getSkills)
route.patch('/skill/update/:id', skill.updateSkill)
route.delete('/skill/delete/:id', skill.deleteSkill)

module.exports = route
