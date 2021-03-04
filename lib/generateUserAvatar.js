import Avatar from 'avatar-builder';
import fs from 'fs';
import path from 'path';
import { IMG_DIR, TEMP_DIR } from '../helpers/constants.js';
import { handleError } from './handlerror.js';

const imageName = Date.now();

async function generateUseAvatar(userData) {
  try {
    const avatar = Avatar.builder(
      Avatar.Image.margin(Avatar.Image.circleMask(Avatar.Image.github())),
      250,
      250,
    );

    await avatar
      .create(userData.email)
      .then(buffer => fs.writeFileSync(`tmp/${imageName}.png`, buffer));

    const tempAvatarPath = path.join(TEMP_DIR, `${imageName}.png`);
    const avatarPath = path.join(IMG_DIR, `${imageName}.png`);

    fs.renameSync(tempAvatarPath, avatarPath);

    return avatarPath;
  } catch (error) {
    handleError(error);
  }
}

export default generateUseAvatar;
