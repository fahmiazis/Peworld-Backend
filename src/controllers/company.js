const { UserDetails } = require('../models')
const { Op } = require('sequelize')
const qs = require('querystring')
const { APP_URL, APP_PORT } = process.env
const response = require('../helpers/response')

module.exports = {
  getUsers: async (req, res) => {
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
        limit = 5
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
      const result = await UserDetails.findAndCountAll({
        where: find,
        order: [['createdAt', 'ASC'], ['jobTitle', 'ASC']],
        limit: limit,
        offset: (page - 1) * limit
      })
      const pageInfo = {
        count: result.count,
        pages: 0,
        currentPage: page,
        limitPerPage: limit,
        nextLink: null,
        prevLink: null
      }
      pageInfo.pages = Math.ceil(result.count / limit)
      const { pages, currentPage } = pageInfo
      if (currentPage < pages) {
        pageInfo.nextLink = `http://${APP_URL}:${APP_PORT}/company/job-seeker/all?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
      }
      if (currentPage > 1) {
        pageInfo.prevLink = `http://${APP_URL}:${APP_PORT}/company/job-seeker/all?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
      }
      if (result) {
        return response(res, 'list job seeker', { result, pageInfo })
      } else {
        return response(res, 'fail to get job seeker', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  getDetailUser: async (req, res) => {
    try {
      const { id } = req.params
      const result = await UserDetails.findOne({
        where: { userId: id }
      })
      if (result) {
        return response(res, 'detail user', { result })
      } else {
        return response(res, 'fail to get detail user', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}
