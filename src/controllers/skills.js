const { Skills } = require('../models')
const response = require('../helpers/response')
const { role } = require('../helpers/validation')
const { Op } = require('sequelize')
const qs = require('querystring')
const { APP_URL, APP_PORT } = process.env

module.exports = {
  postSkill: async (req, res) => {
    try {
      const id = req.user.id
      const { value, error } = role.validate(req.body)
      if (error) {
        return response(res, error.message, {}, 400, false)
      } else {
        const data = {
          ...value,
          userId: id
        }
        const result = await Skills.create(data)
        if (result) {
          return response(res, 'Skills created', { data: result })
        } else {
          return response(res, 'Failed to create', {}, 400, false)
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
        const find = await Skills.findOne({
          where: { [Op.and]: [{ userId: idUser }, { id: id }] }
        })
        if (find) {
          find.update(value)
          return response(res, 'update skills successfully', { data: value })
        } else {
          return response(res, 'update skill failed', {}, 400, false)
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
      const find = await Skills.findOne({
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
      let searchKey = ''
      let find = {}
      if (typeof search === 'object') {
        searchKey = Object.keys(search)[0]
        searchValue = Object.values(search)[0]
      } else {
        searchKey = 'name'
        searchValue = search || ''
      }
      if (!limit) {
        limit = 7
      } else {
        limit = parseInt(limit)
      }
      if (!page) {
        page = 1
      } else {
        page = parseInt(page)
      }
      if (searchKey === 'name') {
        find = { name: { [Op.like]: `%${searchValue}%` } }
      } else {
        find = { name: { [Op.like]: `%${searchValue}%` } }
      }
      const result = await Skills.findAndCountAll({
        where: find,
        group: ['name'],
        order: [['name', 'ASC']],
        limit: limit,
        offset: (page - 1) * limit
      })
      const data = result.count
      const counting = result.count.map(item => {
        return item.count
      })
      const counted = counting.reduce((total, value) => total + value, 0)
      const pageInfo = {
        count: counted,
        pages: 0,
        currentPage: page,
        limitPerPage: limit,
        nextLink: null,
        prevLink: null
      }
      pageInfo.pages = Math.ceil(counted / limit)
      const { pages, currentPage } = pageInfo
      if (currentPage < pages) {
        pageInfo.nextLink = `http://${APP_URL}:${APP_PORT}/job-seeker/skill/get?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
      }
      if (currentPage > 1) {
        pageInfo.prevLink = `http://${APP_URL}:${APP_PORT}/job-seeker/skill/get?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
      }
      if (result) {
        return response(res, 'list skills', { result: data, pageInfo })
      } else {
        return response(res, 'fail to get skills', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}
