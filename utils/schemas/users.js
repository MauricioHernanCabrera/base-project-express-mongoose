const Joi = require('@hapi/joi');

const createOne = Joi.object().keys({
  password: Joi.string().required(),
  email: Joi.string().email()
});

module.exports = {
  createOne
};
