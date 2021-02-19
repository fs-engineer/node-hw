import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

function validateContactId(req, res, next) {
  const {
    params: { userId },
  } = req;

  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: `Id: ${userId} is not valid`,
    });
  }
  next();
}

export default validateContactId;
