const { ImagePortfolio, UserDetails, Portfolio, ImageProfile, Experience, Skills } = require('../models')
const { Op } = require('sequelize')
const response = require('../helpers/response')
const { pagination } = require('../helpers/pagination')

module.exports = {
  listJobSeekers: async (req, res) => {
    try {
      let { limit, page, search, sort } = req.query
      let searchValue = ''
      let sortValue = ''
      if (typeof search === 'object') {
        searchValue = Object.values(search)[0]
      } else {
        searchValue = search || ''
      }
      if (typeof sort === 'object') {
        sortValue = Object.values(sort)[0]
      } else {
        sortValue = sort || 'createdAt'
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
      if (sortValue === 'domicile') {
        const result = await UserDetails.findAndCountAll({
          include: [
            { model: ImageProfile, as: 'avatar' },
            { model: Skills, as: 'skills', limit: 3 }
          ],
          where: {
            [Op.or]: [
              { phone: { [Op.like]: `%${searchValue}%` } },
              { name: { [Op.like]: `%${searchValue}%` } },
              { jobTitle: { [Op.like]: `%${searchValue}%` } },
              { workplace: { [Op.like]: `%${searchValue}%` } },
              { domicile: { [Op.like]: `%${searchValue}%` } }
            ],
            domicile: typeof domicile === 'string'
          },
          order: [[`${sortValue}`, 'ASC']],
          limit: limit,
          offset: (page - 1) * limit
        })
        const pageInfo = pagination('/company/job-seeker/all', req.query, page, limit, result.count)
        if (result) {
          return response(res, 'list job seeker', { result, pageInfo })
        } else {
          return response(res, 'fail to get job seeker', {}, 400, false)
        }
      } else {
        const result = await UserDetails.findAndCountAll({
          include: [
            { model: ImageProfile, as: 'avatar' },
            { model: Skills, as: 'skills', limit: 3 }
          ],
          where: {
            [Op.or]: [
              { phone: { [Op.like]: `%${searchValue}%` } },
              { name: { [Op.like]: `%${searchValue}%` } },
              { jobTitle: { [Op.like]: `%${searchValue}%` } },
              { workplace: { [Op.like]: `%${searchValue}%` } },
              { domicile: { [Op.like]: `%${searchValue}%` } }
            ]
          },
          order: [[`${sortValue}`, 'ASC']],
          limit: limit,
          offset: (page - 1) * limit
        })
        const pageInfo = pagination('/company/job-seeker/all', req.query, page, limit, result.count)
        if (result) {
          return response(res, 'list job seeker', { result, pageInfo })
        } else {
          return response(res, 'fail to get job seeker', {}, 400, false)
        }
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  detailJobSeeker: async (req, res) => {
    try {
      const { id } = req.params
      const result = await UserDetails.findOne({
        include: [
          { model: ImageProfile, as: 'avatar' },
          { model: Portfolio, as: 'portofolio', include: [{ model: ImagePortfolio, as: 'picture' }] },
          { model: Experience, as: 'experience' },
          { model: Skills, as: 'skills' }
        ],
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
