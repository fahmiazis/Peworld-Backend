const { Users, UserDetails, Company } = require('../models')

const bcrypt = require('bcrypt')

const response = require('../helpers/response')
const { registerSeeker, registerCompany } = require('../helpers/validation')

module.exports = {
  register: async (req, res) => {
    try {
      const { role } = req.params
      switch (role) {
        case 'job-seeker': {
          const { value, error } = registerSeeker.validate(req.body)
          if (error) {
            return response(res, error.message, {}, 400, false)
          }
          let { name, email, phone, password } = value
          password = await bcrypt.hash(password, await bcrypt.genSalt())

          const users = { email, password, roleId: 1 }

          const createUser = await Users.create(users)
          if (createUser) {
            const details = { name, phone, userId: createUser.id }

            const createDetails = await UserDetails.create(details)
            if (createDetails) {
              return response(res, 'User created!', { data: { id: createUser.id, value } }, 201)
            } else {
              return response(res, 'Failed to create user', {}, 400, false)
            }
          }
          break
        }
        case 'company': {
          const { value, error } = registerCompany.validate(req.body)
          if (error) {
            return response(res, error.message, {}, 400, false)
          }
          console.log(value)
          let { name, email, company, jobDesk, phone, password } = value
          password = await bcrypt.hash(password, await bcrypt.genSalt())

          const users = { email, password, roleId: 2 }

          const createUser = await Users.create(users)
          if (createUser) {
            const details = { name, company, jobDesk, phone, userId: createUser.id }

            const createDetails = await Company.create(details)
            if (createDetails) {
              return response(res, 'User created!', { data: { id: createUser.id, ...value } }, 201)
            } else {
              return response(res, 'Failed to create user', {}, 400, false)
            }
          }
        }
      }
    } catch (e) {
      if (e.errors) {
        return response(res, e.errors[0].message, {}, 500, false)
      }
      return response(res, e.message, {}, 500, false)
    }
  }
}
