import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { UPLOAD_DIR, IMG_DIR } from './lib/dirPaths.js';
import createDirnameAndFileName from './lib/dirname.js';
import createFolderIsNotExist from './lib/createFolderIsNotExist.js';
import userRouter from './routes/user.route.js';
import contactRouter from './routes/contact.router.js';
import { handleError } from './lib/handlerror.js';
import createDiskStorage from './lib/createDiskStorage.js';
import uploadAvatar from './lib/uploadAvatar.js';

dotenv.config();
const server = express();

const { __dirname } = createDirnameAndFileName(import.meta.url);

//init midlleware
server.use(logger('dev'));
server.use(cors());
server.use(express.json());

//static
server.use(express.static(path.join(__dirname + '/public')));

//multer Disk storage
const upload = createDiskStorage(UPLOAD_DIR);

server.post('/upload', upload.single('avatar'), uploadAvatar);

//routes
server.use('/users', userRouter);
server.use('/contacts', contactRouter);

//errors
server.use((_, res) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Use api on routes: /contacts',
    data: 'Not found',
  });
});

server.use((err, _, res) => {
  res.status(500).json({
    status: 'fail',
    code: 500,
    message: err.message,
    data: 'Internal Server Error',
  });
});

//connect mongo db and start server
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
