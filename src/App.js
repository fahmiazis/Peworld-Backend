const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const { APP_PORT } = process.env

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

const rolesRoutes = require('./routes/roles')
const authRoutes = require('./routes/auth')

app.use('/role', rolesRoutes)
app.use('/auth', authRoutes)

app.listen(APP_PORT, () => {
  console.log(`App is running on port ${APP_PORT}`)
})
