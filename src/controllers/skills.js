const { Skills, skillUser, UserDetails, ImageProfile } = require('../models')
const response = require('../helpers/response')
const { role } = require('../helpers/validation')
const { Op } = require('sequelize')
const { pagination } = require('../helpers/pagination')

module.exports = {
  postSkill: async (req, res) => {
    try {
      const id = req.user.id
      const { value, error } = role.validate(req.body)
      if (error) {
        return response(res, error.message, {}, 400, false)
      } else {
        const find = await Skills.findOne({
          where: {
            name: value.name
          }
        })
        if (find) {
          const data = await skillUser.findOne({
            where: {
              [Op.and]: [{ skillId: find.id }, { userId: id }]
            }
          })
          if (data) {
            return response(res, 'success create skills', { data })
          } else {
            const send = {
              skillId: find.id,
              userId: id
            }
            const result = await skillUser.create(send)
            if (result) {
              return response(res, 'Skills created', { data: result, find })
            } else {
              return response(res, 'Failed to create', {}, 400, false)
            }
          }
        } else {
          const results = await Skills.create(value)
          if (results) {
            const send = {
              skillId: results.id,
              userId: id
            }
            const create = await skillUser.create(send)
            if (create) {
              return response(res, 'Skills created', { data: create, find })
            } else {
              return response(res, 'Failed to create', {}, 400, false)
            }
          } else {
            return response(res, 'Failed to create', {}, 400, false)
          }
        }
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  updateSkill: async (req, res) => {
    try {
      const idUser = req.user.id
      const { id } = req.params
      const { value, error } = role.validate(req.body)
      if (error) {
        return response(res, error.message, {}, 400, false)
      } else {
        const result = await Skills.findOne({
          where: {
            name: value.name
          }
        })
        if (result) {
          const find = await skillUser.findOne({
            where: { [Op.and]: [{ userId: idUser }, { id: id }] }
          })
          if (find) {
            const send = {
              skillId: result.id,
              userId: idUser
            }
            find.update(send)
            return response(res, 'update skills successfully', { data: value })
          } else {
            return response(res, 'Failed to update', {}, 400, false)
          }
        } else {
          const results = await Skills.create(value)
          if (results) {
            const find = await skillUser.findOne({
              where: { [Op.and]: [{ userId: idUser }, { id: id }] }
            })
            if (find) {
              const send = {
                skillId: results.id,
                userId: idUser
              }
              find.update(send)
              return response(res, 'update skills successfully', { data: value })
            } else {
              return response(res, 'Failed to update', {}, 400, false)
            }
          } else {
            return response(res, 'Failed to update', {}, 400, false)
          }
        }
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  deleteSkill: async (req, res) => {
    try {
      const idUser = req.user.id
      const { id } = req.params
      const find = await skillUser.findOne({
        where: { [Op.and]: [{ userId: idUser }, { id: id }] }
      })
      if (find) {
        await find.destroy()
        return response(res, 'delete skill successfully')
      } else {
        return response(res, 'delete failed', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  getSkills: async (req, res) => {
    try {
      let { limit, page, search } = req.query
      let searchValue = ''
      if (typeof search === 'object') {
        searchValue = Object.values(search)[0]
      } else {
        searchValue = search || ''
      }
      if (!limit) {
        limit = 5
      } else {
        limit = parseInt(limit)
      }
      if (!page) {
        page = 1
      } else {
        page = parseInt(page)
      }
      const result = await Skills.findAndCountAll({
        where: {
          name: { [Op.like]: `%${searchValue}%` }
        },
        include: [
          { model: skillUser, as: 'users', include: [{ model: UserDetails, as: 'user', include: [{ model: ImageProfile, as: 'avatar' }] }] }
        ],
        order: [['name', 'ASC']],
        limit: limit,
        offset: (page - 1) * limit
      })
      const pageInfo = pagination('/job-seeker/skill/get', req.query, page, limit, result.count)
      if (result) {
        return response(res, 'list skills', { result, pageInfo })
      } else {
        return response(res, 'fail to get skills', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}
