import Avatar from 'avatar-builder';
import fs from 'fs';
import path from 'path';

async function generateUseAvatar(userData) {
  try {
    const avatar = Avatar.builder(
      Avatar.Image.margin(Avatar.Image.circleMask(Avatar.Image.identicon())),
      128,
      128,
    );

    await avatar
      .create(userData.email)
      .then(buffer =>
        fs.writeFileSync(`tmp/avatar-${userData.email}.png`, buffer),
      );

    const tempAvatarPath = path.join(
      process.cwd(),
      'tmp/',
      `avatar-${userData.email}.png`,
    );
    const uploadAvatarPath = path.join(
      process.cwd(),
      'public/images',
      `avatar-${userData.email}.png`,
    );

    fs.renameSync(tempAvatarPath, uploadAvatarPath);

    return uploadAvatarPath;
  } catch (error) {
    console.log(error.message);
  }
}

export default generateUseAvatar;
