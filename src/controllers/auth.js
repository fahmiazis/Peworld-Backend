const { Users, UserDetails, Company } = require('../models')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { SEEKER_KEY, COMPANY_KEY, TOKEN_EXP } = process.env

const response = require('../helpers/response')
const {
  registerSeeker,
  registerCompany,
  login
} = require('../helpers/validation')
const { verifyRefreshToken, signRefreshToken, signAcessToken } = require('../middleware/auth')

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

          const findEmail = await Users.findAll({ where: { email } })

          if (findEmail.length) {
            return response(res, 'Email already used', {}, 400, false)
          } else {
            const findPhone = await UserDetails.findAll({ where: { phone } })

            if (findPhone.length) {
              return response(res, 'Phone already used', {}, 400, false)
            } else {
              const users = { email, password, roleId: 1 }

              const createUser = await Users.create(users)
              if (createUser) {
                const details = { name, phone, userId: createUser.id, roleId: 1 }
                console.log(details.roleId)
                const createDetails = await UserDetails.create(details)
                if (createDetails) {
                  return response(
                    res,
                    'User created!',
                    { data: { id: createUser.id, email, name, phone } },
                    201
                  )
                } else {
                  return response(res, 'Failed to create user', {}, 400, false)
                }
              }
            }
          }
          break
        }
        case 'company': {
          const { value, error } = registerCompany.validate(req.body)
          if (error) {
            return response(res, error.message, {}, 400, false)
          }
          let { name, email, company, jobTitle, phone, password } = value
          password = await bcrypt.hash(password, await bcrypt.genSalt())

          const findEmail = await Users.findAll({ where: { email } })

          if (findEmail.length) {
            return response(res, 'Email already used', {}, 400, false)
          } else {
            const findPhone = await UserDetails.findAll({ where: { phone } })

            if (findPhone.length) {
              return response(res, 'Phone already used', {}, 400, false)
            } else {
              const users = { email, password, roleId: 2 }

              const createUser = await Users.create(users)
              if (createUser) {
                const userData = {
                  name,
                  workplace: company,
                  phone,
                  jobTitle,
                  userId: createUser.id,
                  roleId: 2
                }
                await UserDetails.create(userData)
                const companyData = {
                  name: company,
                  userId: createUser.id
                }
                await Company.create(companyData)
                return response(
                  res,
                  'User created!',
                  {
                    data: { name, email, company, jobTitle, phone }
                  },
                  201
                )
              } else {
                return response(res, 'Failed to create user', {}, 400, false)
              }
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
                const refreshToken = await signRefreshToken(find.id, roleId)
                jwt.sign(
                  { id: find.id, roleId: 1 },
                  SEEKER_KEY,
                  { expiresIn: TOKEN_EXP },
                  (err, token) => {
                    if (err) {
                      return response(res, err.message, 500, false)
                    } else {
                      return response(res, 'Login as job seeker successfully', {
                        token,
                        refreshToken
                      })
                    }
                  }
                )
              } else {
                return response(res, 'Wrong email or password', {}, 400, false)
              }
              break
            }
            case 'company': {
              if (roleId === 2) {
                jwt.sign(
                  { id: find.id, roleId: 2 },
                  COMPANY_KEY,
                  { expiresIn: TOKEN_EXP },
                  (err, token) => {
                    if (err) {
                      return response(res, err.message, 500, false)
                    } else {
                      return response(res, 'Login as company successfully', {
                        token
                      })
                    }
                  }
                )
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
  },
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body
      if (refreshToken === undefined) {
        return response(res, 'Unauthorize', {}, 401, false)
      }
      const data = await verifyRefreshToken(refreshToken)
      console.log(data)
      const accessToken = await signAcessToken(data.id, data.role)
      const refresToken = await signRefreshToken(data.id, data.role)
      return response(res, 'Succesfully', { accessToken, refresToken })
    } catch (error) {
      console.log(error)
    }
  }
}
