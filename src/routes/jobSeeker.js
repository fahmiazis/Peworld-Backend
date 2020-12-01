const route = require('express').Router()
const expRoute = require('../controllers/experience')

route.post('/experience', expRoute.create)
route.get('/experience', expRoute.getAll)
route.get('/experience/:id', expRoute.get)
route.patch('/experience/:id', expRoute.edit)
route.delete('/experience/:id', expRoute.delete)

module.exports = route
