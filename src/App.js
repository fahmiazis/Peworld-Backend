const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const response = require('../helpers/response')

const app = express()
const { APP_PORT } = process.env

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

// provide static file for storing image
app.use('/uploads', express.static('assets/uploads'))

const { authSeeker, authCompany } = require('./middleware/auth')

const rolesRoutes = require('./routes/roles')
const authRoutes = require('./routes/auth')
const jobSeekerRoutes = require('./routes/jobSeeker')
const companyRoutes = require('./routes/company')

app.use('/role', rolesRoutes)
app.use('/auth', authRoutes)
app.use('/job-seeker', authSeeker, jobSeekerRoutes)
app.use('/company', authCompany, companyRoutes)

app.get('*', (req, res) => {
  response(res, 'Error page not found', {}, 404, false)
})

app.listen(APP_PORT, () => {
  console.log(`App is running on port ${APP_PORT}`)
})
