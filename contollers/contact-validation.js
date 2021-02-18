import Joi from 'joi';
import mongoose from 'mongoose';

const ObjectId = mongoose.isValidObjectId;

function validateContact(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().min(5).max(30).required(),
    phone: Joi.string().min(3).max(30).required(),
  });

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}

function validateUpdateContact(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email().min(5).max(30),
    phone: Joi.string().min(3).max(30),
  }).min(1);

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}
//TODO вернуться к валидации id
function validateContactId(req, res, next) {
  const {
    params: { contactId },
  } = req;

  if (ObjectId(contactId)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Id is not valid',
    });
  }
}

export default {
  validateContact,
  validateUpdateContact,
};
