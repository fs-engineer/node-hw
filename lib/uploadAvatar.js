import fs from 'fs/promises';
import jimp from 'jimp';
import path from 'path';
import { IMG_DIR } from './dirPaths.js';

// const IMG_DIR = path.join(process.cwd(), 'public', 'images');
async function uploadAvatar(req, res) {
  console.log(req.file);
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

    await fs.rename(file.path, path.join(IMG_DIR, file.originalname));
  }

  res.redirect('/');
}

export default uploadAvatar;
