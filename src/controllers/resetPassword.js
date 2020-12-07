const sendMail = require('../helpers/sendMail')
const response = require('../helpers/response')
const { v4: uuidv4 } = require('uuid')
const { Users } = require('../models')
const { resetPassword, resetCode, matchReset } = require('../helpers/validation')
const bcrypt = require('bcrypt')

module.exports = {
  sendResetCode: async (req, res) => {
    try {
      const { value, error } = resetCode.validate(req.body)
      if (error) {
        return response(res, error.message, {}, 400, false)
      } else {
        const { email } = value
        const checkEmail = await Users.findOne({
          where: { email: email }
        })
        if (checkEmail) {
          let resetCode = ''
          resetCode = uuidv4()
          const sendResetCode = await sendMail.mailHelper([email, resetCode])
          if (sendResetCode.rejected.length > 0) {
            return response(res, error.message, {}, 400, false)
          } else {
            await checkEmail.update({ resetCode: resetCode })
            return response(res, 'Success to send reset password to your email')
          }
        } else {
          return response(res, 'Account not found', {}, 404, false)
        }
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  matchResetCode: async (req, res) => {
    try {
      const { value, error } = matchReset.validate(req.body)
      if (error) {
        return response(res, error.message, {}, 400, false)
      } else {
        const { email, resetCode } = value
        const checkEmail = await Users.findOne({ where: { email: email } })
        const resetCodeValues = checkEmail.dataValues.resetCode
        console.log(resetCode === resetCodeValues.toString())
        if (resetCode === resetCodeValues) {
          return response(res, 'Reset Code match', {}, 200, true)
        } else {
          return response(res, 'Reset Code does\'nt match', {}, 400, false)
        }
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { value, error } = resetPassword.validate(req.body)
      if (error) {
        return response(res, error.message, {}, 400, false)
      } else {
        const { email, resetCode, newPassword } = value

        const checkEmail = await Users.findOne({ where: { email: email } })

        if (checkEmail) {
          const resetCodeValues = checkEmail.dataValues.resetCode
          if (resetCode === resetCodeValues) {
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(newPassword, salt)
            await checkEmail.update({ password: hashedPassword, resetCode: '' })
            return response(res, 'Success to reset your password')
          } else {
            return response(res, 'Reset Code does\'nt match', {}, 400, false)
          }
        } else {
          return response(res, 'Account not found', {}, 404, false)
        }
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}
