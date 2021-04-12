const Joi = require('joi')
const { isValidObjectId } = require('mongoose')
const contactsModel = require('./contacts.model')

module.exports.validateCreateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email(),
    phone: Joi.string().max(20),
    favorite: Joi.boolean().default(false),
  })
  const result = schema.validate(req.body)
  if (result.error) {
    return res.status(400).send(result.error)
  }
  next()
}

module.exports.validateUpdateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string().max(20),
    favorite: Joi.boolean(),
  }).or('name', 'email', 'phone', 'favorite')
  const result = schema.validate(req.body)
  if (result.error) {
    return res.status(400).send(result.error)
  }
  next()
}

module.exports.validateId = (req, res, next) => {
  const isValid = isValidObjectId(req.params.contactId)
  if (!isValid) return res.status(404).json({ message: 'ID is invalid' })
  next()
}

module.exports.isOwnerByContactID = async (req, res, next) => {
  const contactId = req.params.contactId
  const contactById = await contactsModel.findOne({
    _id: contactId,
    owner: req.user,
  })
  if (!contactById) {
    res.status(404).send()
  }
  next()
}
