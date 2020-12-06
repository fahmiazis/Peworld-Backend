const { Users, Company, ImagePortfolio, UserDetails, Portfolio, ImageProfile, Experience, skillUser, Skills } = require('../models')
const { Op } = require('sequelize')
const multer = require('multer')
const singleUpload = require('../helpers/singleUpload')
const bcrypt = require('bcrypt')
const fs = require('fs')
const { updateUser, updateCompany } = require('../helpers/validation')
const response = require('../helpers/response')
const { pagination } = require('../helpers/pagination')
const { searchSkill } = require('../utils/company/listJobSeeker')

module.exports = {
  profile: async (req, res) => {
    try {
      const { id } = req.user
      // const result = await Company.findOne({
      //   where: { userId: id },
      //   include: [{
      //     model: Users,
      //     attributes: ['id', 'email', 'roleId']
      //   }, {
      //     model: ImageProfile,
      //     attribute: ['id', 'avatar'],
      //     as: 'companyAvatar'
      //   }]
      // })
      const result = await Users.findOne({
        where: { id: id },
        attributes: ['id', 'email', 'roleId'],
        include: [{
          model: Company
          // as: 'recruiter'
        },
        {
          //    model: Company,
          //    include: {
          model: ImageProfile,
          attribute: ['id', 'avatar'],
          as: 'companyAvatar'
          //    }
        }
        ]
      })
      if (result) {
        return response(res, `Recruiter with id ${id}`, { result })
      } else {
        return response(res, 'fail to get Recruiter Profile', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  updateCompany: async (req, res) => {
    try {
      const { id } = req.user
      const { value, error } = updateCompany.validate(req.body)
      if (error) {
        return response(res, error.message, {}, 400, false)
      }
      const { name, jobDesk, phone, email, description, instagram, linkedin, address, city } = value
      const result = await Company.findOne({
        where: { userId: id }
      })
      if (result) {
        if (name || jobDesk || phone || email || description || instagram || linkedin || address || city) {
          const data = {
            name,
            jobDesk,
            phone,
            email,
            description,
            instagram,
            linkedin,
            address,
            city
          }
          await result.update(data)
          return response(res, 'company Updated successfully!', { data }, 200)
        } else {
          return response(res, 'Atleast fill one column', {}, 400, false)
        }
      } else {
        return response(res, 'Company not found', {}, 404, false)
      }
    } catch (e) {}
  },
  // updateUser mean company who register as users in table Users
  updateUser: async (req, res) => {
    try {
      const { id } = req.user
      const { value, error } = updateUser.validate(req.body)
      if (error) {
        return response(res, error.message, {}, 400, false)
      }
      const { email, password } = value

      if (email && password) {
        const find = await Users.findOne({
          where: { id: id }
        })
        if (find) {
          const salt = await bcrypt.genSalt()
          const hashedPassword = await bcrypt.hash(password, salt)
          const data = {
            email,
            password: hashedPassword
          }
          await find.update({ data })
          return response(res, 'User Updated successfully!', { }, 200)
        }
      } else if (email || password) {
        const find = await Users.findOne({
          where: { id: id }
        })
        if (email) {
          if (find) {
            await find.update({ email })
            return response(res, 'Email Updated successfully!', { email }, 200)
          } else {
            return response(res, 'User not found', {}, 404, false)
          }
        } else if (password) {
          if (find) {
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password, salt)
            await find.update({ password: hashedPassword })
            return response(res, 'Password Updated successfully!', { }, 200)
          } else {
            return response(res, 'User not found', {}, 404, false)
          }
        }
      } else {
        return response(res, 'Atleast fill one column', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  updateAvatar: async (req, res) => {
    const { id } = req.user
    singleUpload(req, res, async function (err) {
      try {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_UNEXPECTED_FILE' && req.file.length === 0) {
            fs.unlinkSync('assets/uploads/' + req.file.filename)
            return response(res, 'fieldname doesnt match', {}, 500, false)
          }
          fs.unlinkSync('assets/uploads/' + req.file.filename)
          return response(res, err.message, {}, 500, false)
        } else if (err) {
          fs.unlinkSync('assets/uploads/' + req.file.filename)
          return response(res, err.message, {}, 401, false)
        }
        const find = await ImageProfile.findOne({
          where: { userId: id }
        })
        const picture = `uploads/${req.file.filename}`
        if (find) {
          const data = {
            avatar: picture
          }
          await find.update(data)
          return response(res, 'Avatar has been Updated successfully', data)
        } else {
          const data = {
            avatar: picture,
            userId: id
          }
          await ImageProfile.create(data)
          return response(res, 'Avatar has been Created successfully', data)
        }
      } catch (e) {
        return response(res, e.message, {}, 401, false)
      }
    })
  },
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
      const result = await UserDetails.findAndCountAll({
        include: [{
          model: Users,
          attributes: ['email', 'roleId'],
          where: { roleId: 1 },
          include: [
            { model: ImageProfile, as: 'profileAvatar' }
          ]
        }, {
          model: skillUser, as: 'skills', include: [{ model: Skills, as: 'skill' }]
        }],
        order: [['domicile', 'ASC']],
        where: {
          [Op.or]: [
            { phone: { [Op.like]: `%${searchValue}%` } },
            { name: { [Op.like]: `%${searchValue}%` } },
            { jobTitle: { [Op.like]: `%${searchValue}%` } },
            { workplace: { [Op.like]: `%${searchValue}%` } },
            { domicile: { [Op.like]: `%${searchValue}%` } }
          ]
        },
        limit: limit,
        offset: (page - 1) * limit
      })
      const pageInfo = pagination('/company/job-seeker/all', req.query, page, limit, result.count)
      if (result.count !== 0) {
        return response(res, 'list job seeker', { result, pageInfo })
      } else if (result.count === 0) {
        return searchSkill(req, res, searchValue, limit, page)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  searchJobSeekers: async (req, res) => {
    try {
      let { limit, page, search, sort } = req.query
      let searchValue = ''
      let jobTitle = ''
      let sortValue = ''
      if (typeof search === 'object') {
        searchValue = Object.values(search)[0]
        jobTitle = Object.values(search)[1]
      } else {
        searchValue = search || ''
        jobTitle = ''
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

      if (searchValue.length > 0) {
        if (sortValue === 'domicile') {
          const result = await UserDetails.findAndCountAll({
            include: [{
              model: Users,
              attributes: ['email', 'roleId'],
              where: { roleId: 1 },
              include: [
                { model: ImageProfile, as: 'profileAvatar' }
              ]
            }, {
              model: skillUser, as: 'skills', include: [{ model: Skills, as: 'skill' }]
            }],
            order: [['domicile', 'ASC']],
            where: {
              [Op.or]: [
                { phone: { [Op.like]: `%${searchValue}%` } },
                { name: { [Op.like]: `%${searchValue}%` } },
                { workplace: { [Op.like]: `%${searchValue}%` } },
                { domicile: { [Op.like]: `%${searchValue}%` } }
              ],
              jobTitle: { [Op.like]: `%${jobTitle}%` }
            },
            limit: limit,
            offset: (page - 1) * limit
          })
          const pageInfo = pagination('/company/job-seeker/all', req.query, page, limit, result.count)
          if (result.count !== 0) {
            return response(res, 'list job seeker', { result, pageInfo })
          } else if (result.count === 0) {
            return searchSkill(req, res, searchValue, jobTitle, limit, page)
          }
        } else if (sortValue === 'skill') {
          const result = await UserDetails.findAndCountAll({
            order: [['userId', 'ASC']],
            include: {
              model: Users,
              attributes: ['email', 'roleId'],
              where: { roleId: 1 },
              include: [
                { model: ImageProfile, as: 'profileAvatar' },
                {
                  model: skillUser, as: 'skills', where: { userId: { [Op.not]: null } }, include: [{ model: Skills, as: 'skill' }]
                }
              ]
            },
            where: {
              [Op.or]: [
                { phone: { [Op.like]: `%${searchValue}%` } },
                { name: { [Op.like]: `%${searchValue}%` } },
                { workplace: { [Op.like]: `%${searchValue}%` } },
                { domicile: { [Op.like]: `%${searchValue}%` } }
              ],
              jobTitle: { [Op.like]: `%${jobTitle}%` }
            },
            limit: limit,
            offset: (page - 1) * limit
          })
          const pageInfo = pagination('/company/job-seeker/all', req.query, page, limit, result.count)
          if (result.count !== 0) {
            return response(res, 'list job seeker', { result, pageInfo })
          } else if (result.count === 0) {
            return searchSkill(req, res, searchValue, jobTitle, limit, page)
          }
        } else {
          const result = await UserDetails.findAndCountAll({
            include: [{
              model: Users,
              where: { roleId: 1 },
              attributes: ['email', 'roleId'],
              include: [
                { model: ImageProfile, as: 'profileAvatar' },
                { model: skillUser, as: 'skills', include: [{ model: Skills, as: 'skill', order: [[{ model: Skills }, searchValue, 'ASC']] }] }
              ]
            }],
            where: {
              [Op.or]: [
                { phone: { [Op.like]: `%${searchValue}%` } },
                { name: { [Op.like]: `%${searchValue}%` } },
                { workplace: { [Op.like]: `%${searchValue}%` } },
                { domicile: { [Op.like]: `%${searchValue}%` } }
              ],
              jobTitle: { [Op.like]: `%${jobTitle}%` }
            },
            order: [['name', 'asc']],
            limit: limit,
            offset: (page - 1) * limit
          })
          const pageInfo = pagination('/company/job-seeker/all', req.query, page, limit, result.count)
          if (result.count !== 0) {
            return response(res, 'list job seeker', { result, pageInfo })
          } else if (result.count === 0) {
            return searchSkill(req, res, searchValue, jobTitle, limit, page)
          } else {
            return response(res, 'fail to get job seeker', {}, 400, false)
          }
        }
      } else if (searchValue.length === 0) {
        console.log(jobTitle)
        const checkByJobTitle = await UserDetails.findAll({
          where: { jobTitle: { [Op.like]: `%${jobTitle}%` } }
        })
        console.log(checkByJobTitle)
        if (checkByJobTitle.length > 0) {
          if (sortValue === 'domicile') {
            const result = await UserDetails.findAndCountAll({
              include: [{
                model: Users,
                attributes: ['email', 'roleId'],
                where: { roleId: 1 },
                include: [
                  { model: ImageProfile, as: 'profileAvatar' }
                ]
              }, {
                model: skillUser, as: 'skills', include: [{ model: Skills, as: 'skill' }]
              }],
              order: [['domicile', 'ASC']],
              where: {
                jobTitle: { [Op.like]: `%${jobTitle}%` }
              },
              limit: limit,
              offset: (page - 1) * limit
            })
            const pageInfo = pagination('/company/job-seeker/all', req.query, page, limit, result.count)
            if (result.count !== 0) {
              return response(res, 'list job seeker', { result, pageInfo })
            } else if (result.count === 0) {
              return searchSkill(req, res, searchValue, '', limit, page)
            }
          } else if (sortValue === 'skill') {
            const result = await UserDetails.findAndCountAll({
              order: [['userId', 'ASC']],
              include: {
                model: Users,
                attributes: ['email', 'roleId'],
                where: { roleId: 1 },
                include: [
                  { model: ImageProfile, as: 'profileAvatar' },
                  {
                    model: skillUser, as: 'skills', where: { userId: { [Op.not]: null } }, include: [{ model: Skills, as: 'skill' }]
                  }
                ]
              },
              where: {
                jobTitle: { [Op.like]: `%${jobTitle}%` }
              },
              limit: limit,
              offset: (page - 1) * limit
            })
            const pageInfo = pagination('/company/job-seeker/all', req.query, page, limit, result.count)
            if (result.count !== 0) {
              return response(res, 'list job seeker', { result, pageInfo })
            } else if (result.count === 0) {
              return searchSkill(req, res, searchValue, '', limit, page)
            }
          } else {
            const result = await UserDetails.findAndCountAll({
              include: [{
                model: Users,
                where: { roleId: 1 },
                attributes: ['email', 'roleId'],
                include: [
                  { model: ImageProfile, as: 'profileAvatar' },
                  { model: skillUser, as: 'skills', include: [{ model: Skills, as: 'skill', order: [[{ model: Skills }, searchValue, 'ASC']] }] }
                ]
              }],
              where: {
                jobTitle: { [Op.like]: `%${jobTitle}%` }
              },
              order: [['name', 'asc']],
              limit: limit,
              offset: (page - 1) * limit
            })
            const pageInfo = pagination('/company/job-seeker/all', req.query, page, limit, result.count)
            if (result.count !== 0) {
              return response(res, 'list job seeker', { result, pageInfo })
            } else if (result.count === 0) {
              return searchSkill(req, res, searchValue, '', limit, page)
            } else {
              return response(res, 'fail to get job seeker', {}, 400, false)
            }
          }
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
      const result = await Users.findOne({
        attributes: ['email', 'roleId'],
        include: [
          {
            model: UserDetails
          },
          { model: ImageProfile, as: 'profileAvatar' },
          { model: skillUser, as: 'skills', include: [{ model: Skills, as: 'skill' }] },
          { model: Portfolio, as: 'portofolio', include: [{ model: ImagePortfolio, as: 'picture' }] },
          { model: Experience, as: 'experience' }
        ],
        where: { id: id, roleId: { [Op.not]: 2 } }
      })
      if (result) {
        return response(res, 'detail job seeker', { result })
      } else {
        return response(res, 'fail to get detail job seeker', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}
