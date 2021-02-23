import bCrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import Avatar from 'avatar-builder';
import path from 'path';
import { handleError } from '../lib/handlerror.js';
import User from '../service/schema/user-schema.js';

async function createUser(req, res) {
  const data = req.body;
  const tempAvatarPath = path.join(
    process.cwd(),
    'tmp/',
    `avatar-${data.email}.png`,
  );
  const uploadAvatarPath = path.join(
    process.cwd(),
    'public/images',
    `avatar-${data.email}.png`,
  );

  const avatar = Avatar.builder(
    Avatar.Image.margin(Avatar.Image.circleMask(Avatar.Image.identicon())),
    128,
    128,
  );

  await avatar
    .create(data.email)
    .then(buffer => fs.writeFileSync(`tmp/avatar-${data.email}.png`, buffer));

  fs.renameSync(tempAvatarPath, uploadAvatarPath);
  console.log(uploadAvatarPath);

  const password = bCrypt.hashSync(data.password, bCrypt.genSaltSync(6));
  const newUser = { ...data, password, avatarURL: uploadAvatarPath };

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
        avatar: user.avatarURL,
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
