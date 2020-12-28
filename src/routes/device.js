const route = require('express').Router()
const deviceController = require('../controllers/deviceToken')
const { authSeeker, authCompany } = require('../middleware/auth')

route.get('/company/remove', authCompany, deviceController.removeDeviceToken)
route.patch('/company/add', deviceController.setDeviceToken)

route.get('/job-seeker/remove', authSeeker, deviceController.removeDeviceToken)
route.patch('/job-seeker/add', deviceController.setDeviceToken)

module.exports = route
