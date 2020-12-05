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
    jobTitle: joi.string().required(),
    phone: joi.string().required(),
    password: joi.string().required().min(8),
    confirmPassword: joi.string().required().min(8).equal(joi.ref('password'))
  }),
  updateCompany: joi.object({
    name: joi.string(),
    company: joi.string(),
    jobDesk: joi.string(),
    phone: joi.string(),
    email: joi.string(),
    description: joi.string(),
    instagram: joi.string(),
    linkedin: joi.string(),
    address: joi.string(),
    city: joi.string()
  }),
  login: joi.object({
    email: joi.string().required(),
    password: joi.string().required()
  }),
  message: joi.object({
    content: joi.string().required()
  }),
  updateUser: joi.object({
    email: joi.string(),
    password: joi.string().required().min(8),
    confirmPassword: joi.string().required().min(8).equal(joi.ref('password'))
  }),
  updateDetailSeeker: joi.object({
    name: joi.string(),
    jobTitle: joi.string(),
    workplace: joi.string(),
    description: joi.string(),
    domicile: joi.string(),
    github: joi.string(),
    instagram: joi.string()
  }),
  experienceSeeker: joi.object({
    jobDesk: joi.string().required(),
    company: joi.string().required(),
    year: joi.string().required(),
    description: joi.string().required()
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
  })
}
