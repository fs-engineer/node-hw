import bCrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';
import { handleError } from '../lib/handlerror.js';
import User from '../service/schema/user-schema.js';
import { httpCode } from '../helpers/constants.js';
import uploadAvatarToCloud from '../service/convertAndUploadAvatar.js';
import sendVerifyMail from '../service/email/email.js';

dotenv.config();

async function createUser(req, res) {
  const data = req.body;

  const verifyToken = nanoid();

  const password = bCrypt.hashSync(data.password, bCrypt.genSaltSync(6));
  const newUser = {
    ...data,
    password,
    verifyToken,
  };

  try {
    const user = await User.create(newUser);

    if (user) {
      sendVerifyMail(data.email, verifyToken);
    }

    return res.status(httpCode.CREATED).json({
      Status: 'Created',
      code: httpCode.CREATED,
      'Content-Type': 'application/json',
      ResponseBody: {
        user: {
          email: user.email,
          subscription: user.subscription,
          avatarURL: user.avatarURL,
        },
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(httpCode.CONFLICT).json({
        Status: 'Conflict',
        code: httpCode.CONFLICT,
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

    const authentication = bCrypt.compareSync(
      userReqData.password,
      user.password,
    );

    if (!user || !authentication) {
      return res.status(httpCode.UNATHORIZED).json({
        Status: 'Unauthorized',
        code: httpCode.UNATHORIZED,
        ResponseBody: 'Email or password id wrong',
      });
    }

    if (authentication) {
      const payload = { _id: user._id };
      const token = jwt.sign(payload, secret, { expiresIn: '3h' });

      await User.findByIdAndUpdate(
        user._id,
        { token },
        {
          new: true,
        },
      );

      return res.status(httpCode.OK).json({
        Status: 'OK,',
        'Content-Type': 'application/json',
        ResponseBody: {
          token: token,
          code: httpCode.OK,
          user: {
            email: user.email,
            subscription: user.subscription,
          },
        },
      });
    }
  } catch (error) {
    handleError(error);
  }
}

async function logout(req, res) {
  const _id = req.user._id;

  try {
    await User.findByIdAndUpdate(_id, { token: null });

    res.status(httpCode.NO_CONTENT).send('no content');
  } catch (error) {
    handleError(error);
  }
}

async function currentUser(req, res) {
  const _id = req.user._id;
  try {
    const user = await User.findById(_id);
    res.status(httpCode.OK).json({
      Status: 'OK',
      code: httpCode.OK,
      'Content-Type': 'application/json',
      ResponseBody: {
        email: user.email,
        subscription: user.subscription,
        avatar: user.avatarURL,
      },
    });
  } catch (error) {
    handleError(error);
  }
}

async function avatar(req, res, next) {
  try {
    const { _id } = req.user;
    const {
      public_id: imgCloudId,
      secure_url: avatarURL,
    } = await uploadAvatarToCloud(req);

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        imgCloudId,
        avatarURL,
      },
      { new: true },
    );

    res.status(httpCode.OK).json({
      ResponseBody: {
        avatarURL: updatedUser.avatarURL,
      },
    });
  } catch (err) {
    handleError(err);
    next(err);
  }
}

async function emailVerify(req, res, next) {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verifyToken: token });
    if (user) {
      await User.updateOne(
        { _id: user.id },
        { verify: true, verifyToken: null },
      );

      return res.status(httpCode.OK).json({
        status: 'success',
        code: httpCode.OK,
        message: 'Verification successful',
      });
    }

    return res.status(httpCode.BAD_REQUEST).json({
      status: 'error',
      code: httpCode.BAD_REQUEST,
      message: 'Link is not valid',
    });
  } catch (e) {
    next(e);
  }
}

export default {
  createUser,
  login,
  logout,
  currentUser,
  avatar,
  emailVerify,
};
