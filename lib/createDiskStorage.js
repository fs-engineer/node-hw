import multer from 'multer';
import path from 'path';

function createDiskStorage(UPLOAD_DIR) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
      const ext = path.parse(file.originalname).ext;
      file.originalname = Date.now() + ext;

      cb(null, file.originalname);
    },
    limits: { fileSize: 1048576 },
  });

  const upload = multer({
    storage: storage,
    fileFilter: (_, file, cb) => {
      if (file.mimetype.includes('image')) {
        cb(null, true);
        return;
      }
      cb(null, false);
    },
  });

  return upload;
}

export default createDiskStorage;
