const joi = require('joi')

module.exports = {
  role: joi.object({
    name: joi.string().required()
  }),
  register: joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    phone: joi.string().required(),
    password: joi.string().required().min(8),
    confirmPassword: joi.string().required().min(8).equal(joi.ref('password'))
  })
}
