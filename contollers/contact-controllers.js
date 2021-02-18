import * as fs from 'fs/promises';
import path from 'path';
import getFileDirName from '../lib/dirname.js';
import { handleError } from '../lib/handlerror.js';
import { v4 as uuidv4 } from 'uuid';
import Contact from '../service/schema/contact-schema.js';

const { __dirname } = getFileDirName(import.meta.url);
const contactsPath = path.join(__dirname, '../db/contacts.json');

async function readContactDB() {
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
    const contacts = await Contact.find();

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
    const { contactId } = req.params;
    const contact = await findOneAndRemove(contactId);

    const contactIndex = contacts.findIndex(({ id }) => id === contactId);

    if (contactIndex === -1) {
      return res.status(404).json({
        status: 'not found',
        code: 404,
        message: 'Not found',
      });
    }

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
    const contacts = await readContactDB();
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
    const contacts = await readContactDB();

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
    const contacts = await readContactDB();
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

export default {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
