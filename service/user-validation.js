import Joi from 'joi';
import { httpCode } from '../helpers/constants.js';

function validateUser(req, res, next) {
  const validationRules = Joi.object({
    email: Joi.string().email().min(5).max(30).required(),
    password: Joi.string().min(5).max(20).alphanum().required(),
  });

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(httpCode.BAD_REQUEST).send({
      Status: 'Bad Request',
      code: httpCode.BAD_REQUEST,
      'Content-Type': 'application/json',
      ResponseBody: validationResult.error.details,
    });
  }

  next();
}

export default validateUser;
