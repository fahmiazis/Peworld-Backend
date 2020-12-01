const { Portfolio, ImagePortfolio } = require('../models')
const response = require('../helpers/response')
const { portofolio, updatePortofolio } = require('../helpers/validation')
const uploadHelper = require('../helpers/upload')
const multer = require('multer')
const { Op } = require('sequelize')

module.exports = {
  postPortofolio: async (req, res) => {
    try {
      const id = req.user.id
      const { value, error } = portofolio.validate(req.body)
      if (error) {
        return response(res, error.message, {}, 400, false)
      } else {
        const data = {
          ...value,
          userId: id
        }
        const result = await Portfolio.create(data)
        if (result) {
          const results = await ImagePortfolio.create({ portFolioId: result.id })
          if (results) {
            return response(res, 'success create portofolio', { result })
          } else {
            return response(res, 'fail to create portofolio', {}, 400, false)
          }
        } else {
          return response(res, 'fail to create portofolio', {}, 400, false)
        }
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  uploadPicturePortofolio: (req, res) => {
    const { id } = req.params
    uploadHelper(req, res, async function (err) {
      try {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_UNEXPECTED_FILE' && req.files.length === 0) {
            console.log(err.code === 'LIMIT_UNEXPECTED_FILE' && req.files.length > 0)
            return response(res, 'fieldname doesnt match', {}, 500, false)
          }
          return response(res, err.message, {}, 500, false)
        } else if (err) {
          return response(res, err.message, {}, 401, false)
        }
        let image = ''
        for (let x = 0; x < req.files.length; x++) {
          const picture = `uploads/${req.files[x].filename}`
          image += picture + ', '
          if (x === req.files.length - 1) {
            image = image.slice(0, image.length - 2)
          }
        }
        const data = {
          picture: image
        }
        const find = await ImagePortfolio.findOne({ where: { portFolioId: id } })
        if (find) {
          const results = await find.update(data)
          if (results) {
            return response(res, 'upload image succesfully', { picture: image })
          } else {
            return response(res, 'upload image failed', {}, 400, false)
          }
        } else {
          return response(res, 'upload image failed', {}, 400, false)
        }
      } catch (e) {
        return response(res, e.message, {}, 500, false)
      }
    })
  },
  getAllPortofolio: async (req, res) => {
    const id = req.user.id
    try {
      const result = await Portfolio.findAndCountAll({
        where: { userId: id }
      })
      if (result) {
        return response(res, 'success get portofolio', { result })
      } else {
        return response(res, 'fail to get portofolio', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  updatePortofolio: async (req, res) => {
    const idUser = req.user.id
    const { id } = req.params
    try {
      const find = await Portfolio.findOne({
        where: { [Op.and]: [{ userId: idUser }, { id: id }] }
      })
      if (find) {
        const { value, error } = updatePortofolio.validate(req.body)
        if (error) {
          return response(res, error.message, {}, 400, false)
        } else {
          const result = await find.update(value)
          if (result) {
            return response(res, 'update portofolio succesfully', { result })
          } else {
            return response(res, 'update portofolio failed', {}, 400, false)
          }
        }
      } else {
        return response(res, 'update portofolio failed', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  getDetailPortofolio: async (req, res) => {
    const idUser = req.user.id
    const { id } = req.params
    try {
      const find = await Portfolio.findOne({
        where: { [Op.and]: [{ userId: idUser }, { id: id }] }
      })
      if (find) {
        return response(res, 'success get portofolio', { find })
      } else {
        return response(res, 'get portofolio failed', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  deletePortofolio: async (req, res) => {
    const idUser = req.user.id
    const { id } = req.params
    try {
      const find = await Portfolio.findOne({
        where: { [Op.and]: [{ userId: idUser }, { id: id }] }
      })
      if (find) {
        const result = await find.destroy()
        if (result) {
          return response(res, 'delete portofolio succesfully')
        } else {
          return response(res, 'delete portofolio failed', {}, 400, false)
        }
      } else {
        return response(res, 'delete portofolio failed', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}