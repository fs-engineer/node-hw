import mongoose from 'mongoose';
import { httpCode } from '../helpers/constants.js';

const ObjectId = mongoose.Types.ObjectId;

function validateContactId(req, res, next) {
  const {
    params: { contactId },
  } = req;

  if (!ObjectId.isValid(contactId)) {
    return res.status(httpCode.BAD_REQUEST).json({
      status: 'error',
      code: httpCode.BAD_REQUEST,
      message: `Id: ${contactId} is not valid`,
    });
  }
  next();
}

export default validateContactId;
