import * as fs from 'fs/promises';
import path from 'path';
import getFileDirName from '../lib/dirname.js';
import { handleError } from '../lib/handlerror.js';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joy';

const { __dirname } = getFileDirName(import.meta.url);
const contactsPath = path.join(__dirname, '../db/contacts.json');

async function listContacts(_, res) {
  try {
    const contactsJSON = await fs.readFile(contactsPath);
    const contacts = await JSON.parse(contactsJSON);

    return res.json({
      status: 'success',
      code: 200,
      data: {
        contacts,
      },
    });
  } catch (error) {
    handleError(error);
  }
}

async function getContactById(req, res) {
  try {
    const contactsJSON = await fs.readFile(contactsPath);
    const contacts = await JSON.parse(contactsJSON);
    const { contactId } = req.params;
    const contact = contacts.filter(contact => contact.id === contactId);

    if (contact.length > 0) {
      res.json({
        status: 'success',
        code: 200,
        data: { contact },
      });
    } else {
      res.json({
        status: 'denied',
        code: 404,
        message: 'Not found',
      });
    }
  } catch (error) {
    handleError(error);
  }
}

async function addContact(req, res) {
  try {
    const res = await fs.readFile(contactsPath);
    const contacts = JSON.parse(res);
    const { name, email, phone } = req.body;
    const newContact = { id: uuidv4(), name, email, phone };

    console.log(newContact);
  } catch (error) {}
}

async function validateUser(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.number().required(),
  });

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}

export default {
  listContacts,
  getContactById,
  validateUser,
};
