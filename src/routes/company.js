const route = require('express').Router()
const jobSeek = require('../controllers/company')

route.get('/job-seeker/all', jobSeek.getUsers)
route.get('/job-seeker/:id', jobSeek.getDetailUser)

module.exports = route
