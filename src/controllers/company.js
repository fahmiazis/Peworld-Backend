const { Users, UserDetails, Company, ImageProfile } = require('../models')
const { Op } = require('sequelize')
const qs = require('querystring')
const multer = require('multer')
const singleUpload = require('../helpers/singleUpload')
const bcrypt = require('bcrypt')
const fs = require('fs')
const { updateUser, updateCompany } = require('../helpers/validation')
const { APP_URL, APP_PORT } = process.env
const response = require('../helpers/response')

module.exports = {
  /* ----------------------------------------------------------
  *
  *  - Under Here is for get profile of company,
  *    update company or update user
  *
  * ----------------------------------------------------------- */
  profile: async (req, res) => {
    try {
      const { id } = req.user
      const result = await Company.findOne({
        where: { userId: id },
        include: {
          model: ImageProfile,
          attribute: ['id', 'avatar'],
          as: 'profileAvatar'
        }
      })
      if (result) {
        return response(res, `Company with id ${id}`, { result })
      } else {
        return response(res, 'fail to get Company Profile', {}, 400, false)
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
      const { name, company, jobDesk, phone, email, description, instagram, linkedin } = value
      const result = await Company.findOne({
        where: { userId: id }
      })
      if (result) {
        if (name || company || jobDesk || phone || email || description || instagram || linkedin) {
          const data = {
            name,
            company,
            jobDesk,
            phone,
            email,
            description,
            instagram,
            linkedin
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
  /* ----------------------------------------------------------
  *
  *   Under Here is for searching or get list of job seeker all,
  *   or get job seeker by id
  *
  * ----------------------------------------------------------- */
  listJobSeekers: async (req, res) => {
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
  detailJobSeeker: async (req, res) => {
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
