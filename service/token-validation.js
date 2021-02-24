import jwt from 'jsonwebtoken';
import User from '../service/schema/user-schema.js';

async function tokenValidation(req, res, next) {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return res.status(403).json({
      Status: 'Unauthorized',
      code: 401,
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

    if (!user) {
      return res.status(403).json({
        Status: 'Unauthorized',
        code: 401,
        'Content-Type': 'application/json',
        ResponseBody: {
          message: 'Not authorized',
        },
      });
    }

    req.user = user;
  } catch (error) {
    return res.status(403).json({
      Status: 'Unauthorized',
      code: 401,
      'Content-Type': 'application/json',
      ResponseBody: {
        message: 'Not authorized',
      },
    });
  }

  next();
}

export default tokenValidation;
