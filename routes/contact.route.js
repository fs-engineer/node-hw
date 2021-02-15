import express, { json } from 'express';
// import fs from 'fs/promises';
// import path from 'path';
import listContacts from '../modules/contacts.js';
import getFileDirName from '../lib/dirname.js';

// const { __dirname } = getFileDirName(import.meta.url);
// const contactsPath = path.join(__dirname, '../db/contacts.json');

const router = express.Router();

router.get('/', async (req, res, next) => {
  console.log(listContacts());
});

export default router;
