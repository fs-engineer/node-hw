import * as fs from 'fs/promises';
import path from 'path';
import getFileDirName from '../lib/dirname.js';
import { handleError } from '../lib/handlerror.js';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';

const { __dirname } = getFileDirName(import.meta.url);
const contactsPath = path.join(__dirname, '../db/contacts.json');

async function listContacts(_, res) {
  try {
    const contactsJSON = await fs.readFile(contactsPath);
    const contacts = await JSON.parse(contactsJSON);

    return res.status(200).json({
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
      res.status(200).json({
        status: 'success',
        code: 200,
        data: { contact },
      });
    } else {
      res.status(404).json({
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
    const contactsJSON = await fs.readFile(contactsPath);
    const contacts = JSON.parse(contactsJSON);
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
    const contactsJSON = await fs.readFile(contactsPath);
    const contacts = JSON.parse(contactsJSON);

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
    const contactsJSON = await fs.readFile(contactsPath);
    const contacts = JSON.parse(contactsJSON);
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

    console.table(contacts);
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
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().alphanum().min(5).max(30).required(),
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
    name: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().alphanum().min(5).max(30),
    phone: Joi.string().min(3).max(30),
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
  addContact,
  removeContact,
  updateContact,
  validateContact,
  validateUpdateContact,
};
