import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs/promises';
import multer from 'multer';
import jimp from 'jimp';
import createDirnameAndFileName from './lib/dirname.js';
import userRouter from './routes/user.route.js';
import contactRouter from './routes/contact.router.js';
import { handleError } from './lib/handlerror.js';

dotenv.config();
const server = express();

//init midlleware
server.use(logger('dev'));
server.use(cors());
server.use(express.json());

//static
const { __dirname } = createDirnameAndFileName(import.meta.url);
server.use(express.static(path.join(__dirname + '/public')));

//multer
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const IMG_DIR = path.join(__dirname, 'public', 'images');

//create DiskStorege
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

server.post('/upload', upload.single('avatar'), async (req, res, next) => {
  if (req.file) {
    const { file } = req;
    const img = jimp.read(file.path);

    await (await img)
      .autocrop()
      .cover(
        250,
        250,
        jimp.HORIZONTAL_ALIGN_CENTER || jimp.VERTICAL_ALIGN_MIDDLE,
      )
      .writeAsync(file.path);

    await fs.rename(file.path, path.join(IMG_DIR, file.originalname));
  }
  // console.log(req.body);
  // console.log(req.file);
  res.redirect('/');
});

server.use('/users', userRouter);
server.use('/contacts', contactRouter);

server.use((_, res) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Use api on routes: /contacts',
    data: 'Not found',
  });
});

server.use((err, _, res) => {
  console.log(err.stack);
  res.status(500).json({
    status: 'fail',
    code: 500,
    message: err.message,
    data: 'Internal Server Error',
  });
});

const isAccessible = async path => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIsNotExist = async folder => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder);
  }
};

const PORT = process.env.PORT || 3000;
const DATA_HOST = process.env.DATA_HOST;

mongoose
  .connect(DATA_HOST, {
    promiseLibrary: global.Promise,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Database connection successful'))
  .catch(err => handleError(err));

server.listen(PORT, async () => {
  try {
    createFolderIsNotExist(UPLOAD_DIR);
    createFolderIsNotExist(IMG_DIR);

    console.log(`Server running. CORS-enabled. Use our API on port ${PORT}.`);
  } catch (error) {
    console.log(`Server not running. Error message: ${error.message}`),
      process.exit(1);
  }
});
