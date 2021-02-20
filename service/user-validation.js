import Joi from 'joi';

function validateNewUser(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().min(5).max(30).required(),
    password: Joi.string(),
    phone: Joi.string().min(10).max(20),
    subscription: Joi.string(),
  });

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}

export default validateNewUser;
