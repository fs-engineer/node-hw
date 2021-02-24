import multer from 'multer';

function createDiskStorage(UPLOAD_DIR) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
      // cb(null, file.fieldname + '-' + Date.now());
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
