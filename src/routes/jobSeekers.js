const route = require('express').Router()
const jobSeekers = require('../controllers/jobSeekers')

route.get('/profile/get', jobSeekers.profile)
route.patch('/profile/detail/update/', jobSeekers.updateProfileDetail) // update detail users
route.patch('/profile/update', jobSeekers.updateUser) // update user (email, password)
route.patch('/profile/avatar/update', jobSeekers.updateAvatar) // update job seeker avatar

module.exports = route
