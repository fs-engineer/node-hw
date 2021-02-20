import { handleError } from '../lib/handlerror.js';
import User from '../service/schema/user-schema.js';
import bCrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function createUser(req, res) {
  const data = req.body;

  const password = bCrypt.hashSync(data.password, bCrypt.genSaltSync(6));
  const newUser = { ...data, password: password };

  try {
    const user = await User.create(newUser);

    return res.status(201).json({
      Status: 'Created',
      code: 201,
      'Content-Type': 'application/json',
      ResponseBody: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        Status: 'Conflict',
        code: 409,
        'Content-Type': 'application/json',
        ResponseBody: {
          message: 'Email in use',
        },
      });
    }
    handleError(error);
  }
}

async function login(req, res) {
  const userData = req.body;
  const secret = process.env.SECRET;

  try {
    const { _id, email, password, subscription } = await User.findOne({
      email: userData.email,
    });
    const authentication = bCrypt.compareSync(userData.password, password);

    if (!authentication) {
      return res.status(401).json({
        Status: 'Unauthorized',
        code: 401,
        ResponseBody: 'Email or password is wrong',
      });
    }

    if (authentication) {
      const payload = { _id };
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });

      User.save;

      return res.status(200).json({
        Status: 'OK,',
        'Content-Type': 'application/json',
        ResponseBody: {
          token: token,
          user: {
            email: email,
            subscription: subscription,
          },
        },
      });
    }
  } catch (error) {
    console.log(error.code);
    handleError(error);
  }
}

async function logout(req, res) {}

export default {
  createUser,
  login,
  logout,
};
