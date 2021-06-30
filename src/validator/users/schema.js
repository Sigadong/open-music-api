const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().min(1).max(40).required(),
  password: Joi.string().min(3).required(),
  fullname: Joi.string().required(),
});

module.exports = { UserPayloadSchema };
