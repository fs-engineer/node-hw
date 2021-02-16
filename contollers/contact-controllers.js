import * as fs from 'fs/promises';
import path from 'path';
import getFileDirName from '../lib/dirname.js';
import { handleError } from '../lib/handlerror.js';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';

const { __dirname } = getFileDirName(import.meta.url);
const contactsPath = path.join(__dirname, '../db/contacts.json');

async function getContactDB() {
  try {
    const contactsJSON = await fs.readFile(contactsPath);
    const contacts = JSON.parse(contactsJSON);
    return contacts;
  } catch (error) {
    handleError(error);
  }
}

async function listContacts(_req, res) {
  try {
    const contacts = await getContactDB();

    await res.status(200).json({
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
    const contacts = await getContactDB();
    const { contactId } = req.params;

    const contactIndex = contacts.findIndex(({ id }) => id === contactId);

    if (contactIndex === -1) {
      return res.status(404).json({
        status: 'not found',
        code: 404,
        message: 'Not found',
      });
    }

    const contact = contacts[contactIndex];

    res.status(200).json({
      status: 'success',
      code: 200,
      data: { contact },
    });
  } catch (error) {
    handleError(error);
  }
}

async function addContact(req, res) {
  try {
    const contacts = await getContactDB();
    const { name, email, phone } = req.body;

    const contact = { id: uuidv4(), name, email, phone };

    contacts.push(contact);

    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        contact,
      },
    });
  } catch (error) {
    handleError(error);
  }
}

async function removeContact(req, res) {
  try {
    const contacts = await getContactDB();

    const { contactId } = req.params;
    const contactIndex = contacts.findIndex(
      contact => contact.id === contactId,
    );

    if (contactIndex === -1) {
      return res.status(404).json({
        status: 'canceled',
        code: 404,
        message: `Id: ${contactId} not found.`,
      });
    } else {
      contacts.splice(contactIndex, 1);
      fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

      res.status(200).json({
        status: 'success',
        code: 200,
        message: `Contact with id: ${contactId} deleted`,
      });
    }
  } catch (error) {
    handleError(error);
  }
}

async function updateContact(req, res) {
  try {
    const contacts = await getContactDB();
    const { contactId } = req.params;

    const contactIndex = contacts.findIndex(({ id }) => id === contactId);

    if (contactIndex === -1) {
      return res.status(404).send('Contact not found.');
    }
    if (!req.body) {
      return res.status(400).send('Missing fields.');
    }

    const updatedContact = {
      ...contacts[contactIndex],
      ...req.body,
    };

    contacts[contactIndex] = updatedContact;

    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    res.json({
      status: 'access',
      code: 200,
      data: {
        updatedContact,
      },
    });
  } catch (error) {
    handleError(error);
  }
}

function validateContact(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().min(5).max(30).required(),
    phone: Joi.string().min(3).max(30).required(),
  });

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}

function validateUpdateContact(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email().min(5).max(30),
    phone: Joi.string().min(3).max(30),
  }).min(1);

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}

export default {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  validateContact,
  validateUpdateContact,
};
