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
const index = express();

//init middleware
index.use(logger('dev'));
index.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
index.use(express.json());

// multer Disk storage
const upload = createDiskStorage(UPLOAD_DIR);

//static
index.use('/images', express.static('public/images'));
//routes
index.use('/users', upload.single('avatar'), userRouter);
index.use('/contacts', contactRouter);

//errors
index.use((_, res) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Use another api route',
    data: 'Not found',
  });
});

index.use((err, _, res) => {
  res.status(500).json({
    status: 'fail',
    code: 500,
    message: err.message,
    data: 'Internal Server Error',
  });
});

//connect mongo db and start index
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

index.listen(PORT, async () => {
  try {
    await createFolderIsNotExist(UPLOAD_DIR);
    await createFolderIsNotExist(IMG_DIR);

    console.log(`Server running. CORS-enabled. Use our API on port ${PORT}.`);
  } catch (error) {
    console.log(`Server not running. Error message: ${error.message}`)
      process.exit(1);
  }
});
