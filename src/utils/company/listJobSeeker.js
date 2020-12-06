const { Users, Company, ImagePortfolio, UserDetails, Portfolio, ImageProfile, Experience, skillUser, Skills } = require('../../models')
const { Op } = require('sequelize')
const response = require('../../helpers/response')
const { pagination } = require('../../helpers/pagination')

module.exports = {
  searchSkill: async (req, res, searchValue, jobTitle, limit, page) => {
    const results = await Skills.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchValue}%` } }
        ]
      },
      include: [
        {
          model: skillUser,
          as: 'users',
          attributes: ['userId'],
          include: [
            {
              model: UserDetails,
              include: [
                {
                  model: Users,
                  attributes: ['email', 'roleId'],
                  include: [
                    { model: ImageProfile, as: 'profileAvatar' },
                    { model: skillUser, attributes: ['userId'], as: 'skills', include: [{ model: Skills, as: 'skill' }] }
                  ]
                }
              ]
            }]
        }
      ],
      limit: limit,
      offset: (page - 1) * limit
    })
    const pageInfo = pagination('/company/job-seeker/all', req.query, page, limit, results.count)
    if (results.count !== 0) {
      const users = results.rows
      const hasil = users.map(user => {
        return user.dataValues
      })
      const cek = hasil[0].users
      let newResult = cek.map(el => {
        return el.dataValues.userId
      })
      let ceks = []
      const newHasil = []
      newResult = newResult.reverse()
      if (jobTitle.length > 0) {
        for (let i = 0; i < newResult.length; i++) {
          ceks = await UserDetails.findAll({
            include: [{
              model: Users,
              attributes: ['email', 'roleId'],
              include: [
                { model: ImageProfile, as: 'profileAvatar' },
                {
                  model: skillUser, as: 'skills', include: [{ model: Skills, as: 'skill' }]
                }
              ]
            }],
            where: { userId: newResult[i], jobTitle: { [Op.like]: `%${jobTitle}%` } },
            limit: limit,
            offset: (page - 1) * limit
          })
          newHasil.push(...ceks)
        }
      } else if (jobTitle.length === 0) {
        for (let i = 0; i < newResult.length; i++) {
          ceks = await UserDetails.findAll({
            include: [{
              model: Users,
              attributes: ['email', 'roleId'],
              include: [
                { model: ImageProfile, as: 'profileAvatar' },
                {
                  model: skillUser, as: 'skills', include: [{ model: Skills, as: 'skill' }]
                }
              ]
            }],
            where: { userId: newResult[i] },
            limit: limit,
            offset: (page - 1) * limit
          })
          newHasil.push(...ceks)
        }
      }
      return response(res, 'list job seeker', { result: { count: newHasil.length, rows: newHasil }, pageInfo })
    } else {
      return response(res, 'fail to get job seeker', {}, 400, false)
    }
  }
}
