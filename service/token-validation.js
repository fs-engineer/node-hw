import jwt from 'jsonwebtoken';
import User from '../service/schema/user-schema.js';
import { httpCode } from '../helpers/constants.js';

async function tokenValidation(req, res, next) {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return res.status(httpCode.UNATHORIZED).json({
      Status: 'Unauthorized',
      code: httpCode.UNATHORIZED,
      'Content-Type': 'application/json',
      ResponseBody: {
        message: 'Not authorized',
      },
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const secret = process.env.SECRET;

  try {
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload._id);

    if (!user || !user.token) {
      return res.status(httpCode.UNATHORIZED).json({
        Status: 'Unauthorized',
        code: httpCode.UNATHORIZED,
        'Content-Type': 'application/json',
        ResponseBody: {
          message: 'Not authorized',
        },
      });
    }

    req.user = user;
  } catch (error) {
    return res.status(httpCode.UNATHORIZED).json({
      Status: 'Unauthorized',
      code: httpCode.UNATHORIZED,
      'Content-Type': 'application/json',
      ResponseBody: {
        message: 'Not authorized',
      },
    });
  }

  next();
}

export default tokenValidation;
