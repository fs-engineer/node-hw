import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import contactRouter from './routes/contact.route.js';

const app = express();

//init midlleware
app.use(logger('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactRouter);

app.use((_, res, __) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Use api on routes: /api/contacts',
    data: 'Not found',
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: 'fail',
    code: 500,
    message: err.message,
    data: 'Internal Server Error',
  });
});

export default app;
