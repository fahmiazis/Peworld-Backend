const route = require('express').Router()
const jobSeekers = require('../controllers/jobSeekers')
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

route.get('/company/all', jobSeekers.listCompany)
route.get('/company/:id', jobSeekers.detailCompany)

route.get('/profile/get', jobSeekers.profile)
route.patch('/profile/detail/update/', jobSeekers.updateProfileDetail) // update detail users
route.patch('/profile/update', jobSeekers.updateUser) // update user (email, password)
route.patch('/profile/avatar/update', jobSeekers.updateAvatar) // update job seeker avatar

module.exports = route
