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
  const userReqData = req.body;
  const secret = process.env.SECRET;

  try {
    const user = await User.findOne({
      email: userReqData.email,
    });
    if (!user) {
      return res.status(401).json({
        Status: 'Unauthorized',
        code: 401,
        ResponseBody: 'Email or password id wrong',
      });
    }
    const authentication = bCrypt.compareSync(
      userReqData.password,
      user.password,
    );

    if (!authentication) {
      return res.status(401).json({
        Status: 'Unauthorized',
        code: 401,
        ResponseBody: 'Email or password is wrong',
      });
    }

    if (authentication) {
      const payload = { _id: user._id };
      const token = jwt.sign(payload, secret, { expiresIn: '1d' });

      await User.findByIdAndUpdate(
        user._id,
        { token },
        {
          new: true,
        },
      );

      return res.status(200).json({
        Status: 'OK,',
        'Content-Type': 'application/json',
        ResponseBody: {
          token: token,
          user: {
            email: user.email,
            subscription: user.subscription,
          },
        },
      });
    }
  } catch (error) {
    console.log(error.code);
    handleError(error);
  }
}

async function logout(req, res) {
  const _id = req.user._id;

  try {
    await User.findByIdAndUpdate(
      _id,
      { token: '' },
      {
        new: true,
      },
    );

    res.status(204).send('No Content');
  } catch (error) {
    handleError(error);
  }
}

async function currentUser(req, res) {
  const _id = req.user._id;
  try {
    const user = await User.findById(_id);
    res.status(200).json({
      Status: 'OK',
      code: 200,
      'Content-Type': 'application/json',
      ResponseBody: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    handleError(error);
  }
}

export default {
  createUser,
  login,
  logout,
  currentUser,
};
