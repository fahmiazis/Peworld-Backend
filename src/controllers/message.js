const { Users, Message } = require('../models')

const response = require('../helpers/response')
const { message } = require('../helpers/validation')
const { Op } = require('sequelize')

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
  }
}
