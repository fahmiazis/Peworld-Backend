const { Roles } = require('../models')

const response = require('../helpers/response')
const { role } = require('../helpers/validation')

module.exports = {
  create: async (req, res) => {
    try {
      const { value, error } = role.validate(req.body)

      if (error) {
        return response(res, error.message, {}, 400, false)
      } else {
        const results = await Roles.create(value)

        if (results) {
          return response(res, 'Role created!', { data: results }, 201)
        } else {
          return response(res, 'Failed to create', {}, 400, false)
        }
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}
