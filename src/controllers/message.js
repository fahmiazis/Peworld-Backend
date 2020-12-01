const { Users, Message } = require('../models')

const { Op } = require('sequelize')

const response = require('../helpers/response')
const { message } = require('../helpers/validation')
const { pagination } = require('../helpers/pagination')

module.exports = {
  sendMsg: async (req, res) => {
    try {
      const { id: sender } = req.user
      const recipient = parseInt(req.params.id)
      const { value, error } = message.validate(req.body)
      const { content } = value

      if (error) {
        return response(res, error.message, {}, 400, false)
      }

      const findUser = await Users.findByPk(recipient)

      if (findUser) {
        const changeLasted = await Message.update({ isLatest: false }, {
          where: {
            sender: {
              [Op.or]: [sender, recipient]
            },
            recipient: {
              [Op.or]: [sender, recipient]
            },
            isLatest: true
          }
        })

        if (changeLasted) {
          const data = { sender, recipient, content, isLatest: true, isRead: false }

          const send = await Message.create(data)

          if (send) {
            return response(res, 'Send message successfully', { data: send }, 201)
          } else {
            return response(res, 'Failed to send message', {}, 400, false)
          }
        } else {
          return response(res, 'Failed to send message', {}, 400, false)
        }
      } else {
        return response(res, 'Recipient not found', {}, 404, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  listMsg: async (req, res) => {
    try {
      const { id } = req.user
      const { page = 1, limit = 10 } = req.query
      const count = await Message.count({
        where: {
          [Op.or]: [{ sender: id }, { recipient: id }],
          isLatest: true
        }
      })

      const pageInfo = pagination('job-seeker/message/list', req.query, page, limit, count)

      const results = await Message.findAll({
        where: {
          [Op.or]: [{ sender: id }, { recipient: id }],
          isLatest: true
        },
        order: [['createdAt', 'DESC']]
      })

      return response(res, 'List of message', { data: results, pageInfo })
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  listChat: async (req, res) => {
    try {
      const { id: userId } = req.user
      const { id: friendId } = req.params
      const { page = 1, limit = 10 } = req.query

      const count = await Message.count({
        where: {
          sender: {
            [Op.or]: [userId, friendId]
          },
          recipient: {
            [Op.or]: [userId, friendId]
          }
        }
      })

      const pageInfo = pagination(`job-seeker/message/${friendId}`, req.query, page, limit, count)

      const results = await Message.findAll({
        where: {
          sender: {
            [Op.or]: [userId, friendId]
          },
          recipient: {
            [Op.or]: [userId, friendId]
          }
        },
        order: [['createdAt', 'DESC']],
        limit: pageInfo.limit,
        offset: pageInfo.offset
      })

      return response(res, 'List of chat', { data: results, pageInfo })
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}
