import fs from 'fs/promises';
import jimp from 'jimp';
import path from 'path';
import { httpCode, IMG_DIR } from '../helpers/constants.js';
import { handleError } from '../lib/handlerror.js';
import changeUserAvatar from './saveAvatarUrlToUser.js';

async function convertAndUploadAvatar(req, res) {
  try {
    if (req.file) {
      const { file } = req;
      const img = await jimp.read(file.path);

      await img
        .autocrop()
        .cover(
          250,
          250,
          jimp.HORIZONTAL_ALIGN_CENTER || jimp.VERTICAL_ALIGN_MIDDLE,
        )
        .writeAsync(file.path);

      const uploadsPath = path.join(IMG_DIR, file.originalname);

      await fs.rename(file.path, uploadsPath);

      const updatedURL = await changeUserAvatar(req, uploadsPath);

      res.status(httpCode.OK).json({
        ResponseBody: {
          avatarURL: updatedURL,
        },
      });
    }
  } catch (err) {
    handleError(err);
  }
}

export default convertAndUploadAvatar;
