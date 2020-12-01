const joi = require('joi')

module.exports = {
  role: joi.object({
    name: joi.string().required()
  }),
  registerSeeker: joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    phone: joi.string().required(),
    password: joi.string().required().min(8),
    confirmPassword: joi.string().required().min(8).equal(joi.ref('password'))
  }),
  registerCompany: joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    company: joi.string().required(),
    jobDesk: joi.string().required(),
    phone: joi.string().required(),
    password: joi.string().required().min(8),
    confirmPassword: joi.string().required().min(8).equal(joi.ref('password'))
  }),
  login: joi.object({
    email: joi.string().required(),
    password: joi.string().required()
  }),
  updateSeeker: joi.object({
    email: joi.string(),
    password: joi.string()
  }),
  updateDetailSeeker: joi.object({
    name: joi.string(),
    jobTitle: joi.string(),
    workplace: joi.string(),
    description: joi.string(),
    domicile: joi.string(),
    github: joi.string(),
    instagram: joi.string()
  })
}
