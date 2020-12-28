const response = require('../helpers/response')
const { Users } = require('../models')
const joi = require('joi')

module.exports = {
  setDeviceToken: async (req, res) => {
    const schema = joi.object({
      deviceToken: joi.string(),
      email: joi.string()
    })
    const { value: results, error } = schema.validate(req.body)
    if (error) {
      return response(res, 'Error', { error: error.message }, 400, false)
    } else {
      const { deviceToken, email } = results
      try {
        const check = await Users.findOne({
          where: { email: email },
          attributes: ['id', 'password']
        })
        if (check) {
          check.update({ deviceToken: deviceToken })
          return response(res, 'Device token is set', {}, 200, true)
        } else {
          return response(res, 'Fail to set device token', {}, 400, false)
        }
      } catch (e) {
        return response(res, e.message, {}, 500, false)
      }
    }
  },
  removeDeviceToken: async (req, res) => {
    const { id } = req.user
    const results = await Users.findByPk(id)
    if (results) {
      await results.update({ deviceToken: '' })
      return response(res, 'Device token is removed', {}, 200, true)
    } else {
      return response(res, 'Users not found', {}, 404, false)
    }
  }
}
