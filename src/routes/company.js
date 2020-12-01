const route = require('express').Router()
const company = require('../controllers/company')

route.get('/profile/get', company.profile)
route.get('/job-seeker/all', company.listJobSeekers)
route.get('/job-seeker/:id', company.detailJobSeeker)
route.patch('/profile/update', company.updateCompany) // update company detail
route.patch('/update/user', company.updateUser) // update user like email and password

module.exports = route
