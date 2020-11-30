const { Users, UserDetails, Company } = require('../models')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { SEEKER_KEY, COMPANY_KEY, TOKEN_EXP } = process.env

const response = require('../helpers/response')
const { registerSeeker, registerCompany, login } = require('../helpers/validation')

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
              return response(res, 'User created!', { data: { id: createUser.id, ...value } }, 201)
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
  },
  login: async (req, res) => {
    try {
      const { role } = req.params
      const { value, error } = login.validate(req.body)
      if (error) {
        return response(res, error.message, {}, 400, false)
      }
      const { email, password } = value

      const find = await Users.findOne({ where: { email } })
      if (find) {
        const roleId = find.roleId
        const compared = await bcrypt.compare(password, find.password)
        if (compared) {
          switch (role) {
            case 'job-seeker': {
              if (roleId === 1) {
                jwt.sign({ id: find.id }, SEEKER_KEY, { expiresIn: TOKEN_EXP }, (err, token) => {
                  if (err) {
                    return response(res, err.message, 500, false)
                  } else {
                    return response(res, 'Login as job seeker successfully', { token })
                  }
                })
              } else {
                return response(res, 'Wrong email or password', {}, 400, false)
              }
              break
            }
            case 'company': {
              if (roleId === 2) {
                jwt.sign({ id: find.id }, COMPANY_KEY, { expiresIn: TOKEN_EXP }, (err, token) => {
                  if (err) {
                    return response(res, err.message, 500, false)
                  } else {
                    return response(res, 'Login as company successfully', { token })
                  }
                })
              } else {
                return response(res, 'Wrong email or password', {}, 400, false)
              }
            }
          }
        } else {
          return response(res, 'Wrong email or password', {}, 400, false)
        }
      } else {
        return response(res, 'Wrong email or password', {}, 400, false)
      }
      // switch (role) {
      //   case 'job-seeker': {

      //   }
      // }
    } catch (e) {
      console.log(e)
      return response(res, e.message, {}, 500, false)
    }
  }
}
