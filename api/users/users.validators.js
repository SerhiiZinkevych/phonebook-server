const Joi = require('joi')

module.exports.validateAuth = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .required()
      .pattern(/^[a-zA-Z0-9]{3,30}$/),
  })
  const result = schema.validate(req.body)
  if (result.error) {
    return res.status(400).send(result.error)
  }
  next()
}

module.exports.validateSubscription = (req, res, next) => {
  const schema = Joi.object({
    subscription: Joi.string().valid('starter', 'pro', 'business').required(),
  })
  const result = schema.validate(req.body)
  if (result.error) {
    return res.status(400).send(result.error)
  }
  next()
}
