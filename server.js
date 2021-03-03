import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { UPLOAD_DIR, IMG_DIR, PUBLIC_DIR } from './helpers/constants.js';
import createFolderIsNotExist from './lib/createFolderIsNotExist.js';
import userRouter from './routes/user.route.js';
import contactRouter from './routes/contact.router.js';
import { handleError } from './lib/handlerror.js';
import createDiskStorage from './lib/createDiskStorage.js';
import convertAndUploadAvatar from './service/convertAndUploadAvatar.js';
import tokenValidation from './service/token-validation.js';

dotenv.config();
const server = express();

//init midlleware
server.use(logger('dev'));
server.use(cors());
server.use(express.json());

//static
server.use(express.static(PUBLIC_DIR));

//multer Disk storage
const upload = createDiskStorage(UPLOAD_DIR);

server.patch(
  '/users/avatars',
  upload.single('avatar'),
  tokenValidation,
  convertAndUploadAvatar,
);

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
  .catch(err => {
    console.log('Database disconnected');
    handleError(err);
  });

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
