const jwt = require('jsonwebtoken')
const response = require('../helpers/response')

const { SEEKER_KEY, COMPANY_KEY } = process.env

module.exports = {
  authSeeker: (req, res, next) => {
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.slice(7, authorization.length)
      try {
        const verify = jwt.verify(token, SEEKER_KEY)
        if (verify) {
          req.user = verify
          next()
        } else {
          return response(res, 'Unauthoraized', {}, 401, false)
        }
      } catch (err) {
        return response(res, err.message, {}, 500, false)
      }
    } else {
      return response(res, 'Forbidden Access', {}, 403, false)
    }
  },
  authCompany: (req, res, next) => {
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.slice(7, authorization.length)
      try {
        const verify = jwt.verify(token, COMPANY_KEY)
        if (verify) {
          req.user = verify
          next()
        } else {
          return response(res, 'Unauthoraized', {}, 401, false)
        }
      } catch (err) {
        return response(res, err.message, {}, 500, false)
      }
    } else {
      return response(res, 'Forbidden Access', {}, 403, false)
    }
  }
}
