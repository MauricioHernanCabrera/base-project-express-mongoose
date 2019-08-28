const Joi = require('@hapi/joi');

const forgot = Joi.object().keys({
  email: Joi.string().required()
});

const reset = Joi.object().keys({
  password: Joi.string().required()
});

module.exports = {
  forgot,
  reset
};
