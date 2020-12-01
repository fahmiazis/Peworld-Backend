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
  message: joi.object({
    content: joi.string().required()
  }),
  portofolio: joi.object({
    name: joi.string().required(),
    linkApp: joi.string().required(),
    description: joi.string().required(),
    github: joi.string().required(),
    workplace: joi.string().required(),
    type: joi.string().required()
  }),
  updatePortofolio: joi.object({
    name: joi.string(),
    linkApp: joi.string(),
    description: joi.string(),
    github: joi.string(),
    workplace: joi.string(),
    type: joi.string()
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
