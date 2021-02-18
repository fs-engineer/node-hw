import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

function validateContactId(req, res, next) {
  const {
    params: { contactId },
  } = req;

  if (!ObjectId.isValid(contactId)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: `Id: ${contactId} is not valid`,
    });
  }
  next();
}

export default {
  validateContactId,
};
