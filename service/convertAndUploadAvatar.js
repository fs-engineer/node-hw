import fs from 'fs/promises';
import jimp from 'jimp';
import path from 'path';
import { httpCode, IMG_DIR } from '../helpers/constants.js';
import { handleError } from '../lib/handlerror.js';
import changeUserAvatar from './saveAvatarUrlToUser.js';
import { promisify } from 'util';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadCloud = promisify(cloudinary.v2.uploader.upload);

// async function convertAndUploadAvatar(req, res) {
//   try {
//     if (req.file) {
//       const { file } = req;
//       const img = await jimp.read(file.path);

//       await img
//         .autocrop()
//         .cover(
//           250,
//           250,
//           jimp.HORIZONTAL_ALIGN_CENTER || jimp.VERTICAL_ALIGN_MIDDLE,
//         )
//         .writeAsync(file.path);

//       const uploadsPath = path.join(IMG_DIR, file.originalname);

//       await fs.rename(file.path, uploadsPath);

//       const updatedURL = await changeUserAvatar(req, uploadsPath);

//       res.status(httpCode.OK).json({
//         ResponseBody: {
//           avatarURL: updatedURL,
//         },
//       });
//     }
//   } catch (err) {
//     handleError(err);
//   }
// }

async function uploadAvatarToCloud(req) {
  const filePath = req.file.path;
  const result = await uploadCloud(filePath, {
    folder: 'images',
    transformation: { width: 250, height: 250, crop: 'fill' },
  });

  cloudinary.v2.uploader.destroy(req.user.imgCloudId, (err, result) => {
    if (result) console.log(result);
    if (err) console.log(err);
  });

  try {
    await fs.unlink(filePath);
  } catch (error) {
    handleError(error);
  }
  return result;
}

export default uploadAvatarToCloud;
