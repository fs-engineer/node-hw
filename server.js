import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import contactRouter from './routes/contact.route.js';
import Types from 'mongoose';

dotenv.config();
const server = express();

//init midlleware
server.use(logger('dev'));
server.use(cors());
server.use(express.json());

server.use('/contacts', contactRouter);

server.use((_, res, __) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Use api on routes: /contacts',
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
const DB_NAME = process.env.DB_NAME;
const DB_PASS = process.env.DB_PASS;

const MONGO_URL = `mongodb+srv://admin:${DB_PASS}@cluster0.nhmab.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const connection = mongoose.connect(MONGO_URL, {
  promiseLibrary: global.Promise,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

connection
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running. CORS-enabled. Use our API on port ${PORT}`);
    });
  })
  .catch(err =>
    console.log(`Server not running. Error message: ${err.message}`),
  );
