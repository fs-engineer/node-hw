import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import contactRouter from './routes/contact.router.js';

dotenv.config();
const server = express();

//init midlleware
server.use(logger('dev'));
server.use(cors());
server.use(express.json());

// server.use('/users', userRouter);
server.use('/contacts', contactRouter);

server.use((_, res, __) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Use api on routes: /users',
    data: 'Not found',
  });
});

server.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: 'fail',
    code: 500,
    message: err.message,
    data: 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 3000;
const DATA_HOST = process.env.DATA_HOST;

const connection = mongoose.connect(DATA_HOST, {
  promiseLibrary: global.Promise,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

connection
  .then(() => {
    server.listen(PORT, () => {
      console.log(
        `Server running. CORS-enabled. Use our API on port ${PORT}. Database connection successful`,
      );
    });
  })
  .catch(err => {
    console.log(`Server not running. Error message: ${err.message}`),
      process.exit(1);
  });
