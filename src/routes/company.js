const route = require('express').Router()
const company = require('../controllers/company')
const messageController = require('../controllers/message')
const resetPassword = require('../controllers/resetPassword')

route.get('/job-seeker/all', company.listJobSeekers) // list jobseekers
route.get('/job-seeker/search', company.searchJobSeekers) // list jobseeker with advance function
route.get('/job-seeker/:id', company.detailJobSeeker)

route.get('/profile/get', company.profile)
route.patch('/profile/update', company.updateCompany) // update company detail
route.patch('/update/user', company.updateUser) // update user like email and password
route.patch('/profile/avatar/update', company.updateAvatar) // update job seeker avatar
route.patch('/profile/reset/send', resetPassword.sendResetCode) // send reset code to email
route.patch('/profile/reset/password', resetPassword.resetPassword) // reset password

route.post('/message/:id', messageController.sendMsg)
route.get('/message/list', messageController.listMsg)
route.get('/message/:id', messageController.listChat)

module.exports = route
