import fs from 'fs/promises';
import jimp from 'jimp';
import path from 'path';
import { IMG_DIR } from '../lib/dirPaths.js';
import { handleError } from '../lib/handlerror.js';

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

      const imageExtansion = file.originalname.slice(-4);
      const newImageName = Date.now() + imageExtansion;

      await fs.rename(file.path, path.join(IMG_DIR, newImageName));
    }

    res.send('Image uploaded');
  } catch (err) {
    handleError(err);
  }
}

export default convertAndUploadAvatar;
