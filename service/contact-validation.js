import Joi from 'joi';

function contactValidation(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().min(5).max(30).required(),
    phone: Joi.string().min(3).max(30).required(),
    subscription: Joi.string(),
    password: Joi.string().min(6).max(20).required(),
    token: Joi.string(),
  });

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}

export default contactValidation;
