import express from 'express';
import logger from 'morgan';
import cors from 'cors';

import program from './lib/commander.js';
import contactRouter from './routes/contact.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

//init midlleware
app.use(logger('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactRouter);

app.listen(PORT, () => {
  console.log(`CORS-enabled web server listening on port ${PORT}`);
});

// program.parse(process.argv);
// const options = program.opts();

// function invokeOptions(options = null) {
//   if (options.list) {
//     contacts.listContacts();
//   } else if (options.get) {
//     const id = Number(options.get);

//     contacts.getContactById(id);
//   } else if (options.remove) {
//     const id = Number(options.remove);

//     contacts.removeContact(id);
//   } else if (options.add) {
//     const { name, email, phone } = options;

//     contacts.addContact(name, email, phone);
//   } else {
//     console.warn('\x1B[31m Unknown action type!');
//   }
// }

// invokeOptions(options);
