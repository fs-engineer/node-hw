import Joi from 'joi';

function validateNewUser(req, res, next) {
  const validationRules = Joi.object({
    email: Joi.string().email().min(5).max(30).required(),
    password: Joi.string().min(5).max(20).alphanum().required(),
  });

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send({
      Status: 'Bad Request',
      code: 400,
      'Content-Type': 'application/json',
      ResponseBody: validationResult.error.details,
    });
  }

  next();
}

export default validateNewUser;
