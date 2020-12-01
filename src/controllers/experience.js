const { Experience } = require('../models')
const response = require('../helpers/response')
const { experienceSeeker } = require('../helpers/validation')

module.exports = {
  create: async (req, res) => {
    try {
      const { id } = req.user
      const { value, error } = experienceSeeker.validate(req.body)
      if (error) {
        return response(res, error.message, {}, 400, false)
      } else {
        const data = {
          ...value,
          userId: id
        }
        const result = await Experience.create(data)
        if (result) {
          return response(res, 'Experience added', { result })
        } else {
          return response(res, 'Failed add new experience', {}, 400, false)
        }
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  getAll: async (req, res) => {
    try {
      const result = await Experience.findAll()
      if (result) {
        return response(res, 'Data experience job-seeker', { result })
      } else {
        return response(res, 'No data found', {})
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  get: async (req, res) => {
    try {
      const { id } = req.params
      const result = await Experience.findByPk(id)
      if (result) {
        return response(res, `Data experience ${id}`, { result })
      } else {
        return response(res, 'No data found', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  edit: async (req, res) => {
    try {
      const userId = req.user.id
      const { id } = req.params
      const data = { ...req.body, ...userId }
      const find = await Experience.findByPk(id)
      const result = await find.update(data)
      if (result) {
        return response(res, `Data experience ${id} updated`, { result })
      } else {
        return response(res, 'Failed update experience', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params
      const result = await Experience.destroy({ where: { id: id } })
      if (result) {
        return response(res, `Experience ${id} deleted`, {})
      } else {
        return response(res, `Failed delete experience ${id}`, {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}
