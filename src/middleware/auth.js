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
  },
  signAcessToken: (userid, role) => {
    return new Promise((resolve, reject) => {
      const payload = {
        userid,
        role
      }
      const secret = process.env.SEEKER_KEY
      const options = {
      }
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        resolve(token)
      })
    })
  },
  signRefreshToken: (userid, role) => {
    return new Promise((resolve, reject) => {
      const payload = {
        id: userid,
        role
      }
      const secret = process.env.REFRESH_TOKEN_SECRET
      const options = {
      }
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(err)
        }
        resolve(token)
      })
    })
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) return reject(err)
        const userId = payload.id
        const role = payload.role
        const data = {
          userId,
          role
        }
        resolve(data)
      })
    })
  }
}
