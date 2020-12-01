const { UserDetails, Users, ImageProfile } = require('../models')
const { Op } = require('sequelize')
const qs = require('querystring')
const { APP_URL, APP_PORT } = process.env
const response = require('../helpers/response')
const { updateDetailSeeker, updateSeeker } = require('../helpers/validation')
const { SEEKER_KEY, TOKEN_EXP } = process.env
const bcrypt = require('bcrypt')
const multer = require('multer')
const singleUpload = require('../helpers/singleUpload')
const fs = require('fs')

module.exports = {
  profile: async (req, res) => {
    try {
      const { id } = req.user
      const result = await UserDetails.findOne({
        where: { userId: id }
      })
      if (result) {
        return response(res, `Profile of user with id ${id}`, { result })
      } else {
        return response(res, 'fail to get User Profile', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  updateUser: async (req, res) => {
    try {
      const { id } = req.user
      const { value, error } = updateSeeker.validate(req.body)
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
  updateProfileDetail: async (req, res) => {
    try {
      const { id } = req.user
      const { value, error } = updateDetailSeeker.validate(req.body)
      if (error) {
        return response(res, error.message, {}, 400, false)
      }
      const { name, jobTitle, workplace, description, domicile, github, instagram } = value
      const result = await UserDetails.findOne({
        where: { userId: id }
      })
      if (result) {
        if (name || jobTitle || workplace || description || domicile || github || instagram) {
          const data = {
            name,
            jobTitle,
            workplace,
            description,
            domicile,
            github,
            instagram
          }
          await result.update(data)
          return response(res, 'User Updated successfully!', { data }, 200)
        } else {
          return response(res, 'Atleast fill one column', {}, 400, false)
        }
      } else {
        return response(res, 'User not found', {}, 404, false)
      }
    } catch (e) {}
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
        console.log(find)
        if (find) {
          const data = {
            avatar: picture
          }
          await find.update(data)
          return response(res, 'Avatar has been Updated successfully', data)
        } else {
          console.log('disini')
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
  }
}
