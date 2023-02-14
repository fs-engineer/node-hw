import { handleError } from '../lib/handlerror.js';
import User from './schema/user-schema.js';

async function changeUserAvatar(req, imgPath) {
  console.log(req);
  try {
    const { _id } = req.user;
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        avatarURL: imgPath,
      },
      { new: true },
    );

    return updatedUser.avatarURL;
  } catch (err) {
    handleError(err);
  }
}

export default changeUserAvatar;
