const Joi = require("joi");

module.exports.validateCreateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required().max(20),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error);
  }
  next();
};

module.exports.validateUpdateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string().max(20),
  }).or("name", "email", "phone");
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error);
  }
  next();
};
