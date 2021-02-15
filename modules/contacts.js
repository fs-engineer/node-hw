import * as fs from 'fs/promises';
import path from 'path';
import getFileDirName from '../lib/dirname.js';
import { handleError } from '../lib/handlerror.js';
import { v4 as uuidv4 } from 'uuid';

const { __dirname } = getFileDirName(import.meta.url);
const contactsPath = path.join(__dirname, '../db/contacts.json');

async function listContacts() {
  try {
    const res = await fs.readFile(contactsPath);
    console.table(JSON.parse(res));
    return JSON.parse(res);
  } catch (error) {
    handleError(error);
  }
}

async function getContactById(contactId) {
  try {
    const res = await fs.readFile(contactsPath);
    const data = JSON.parse(res);
    const contact = data.filter(contact => contact.id === contactId);
    if (contact.length === 0) {
      console.log(`Id:${contactId} not found!`);
      return `Id:${contactId} not found!`;
    } else {
      console.table(contact);
      return contact;
    }
  } catch (error) {
    handleError(error);
  }
}

async function removeContact(contactId) {
  console.log(contactId);
  try {
    const res = await fs.readFile(contactsPath);
    const data = JSON.parse(res);
    const contacts = data.filter(contact => contact.id !== contactId);

    if (contacts.length !== data.length) {
      fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

      console.log(`Contact with id: ${contactId} removed!`);
    } else {
      console.log(`No contacts with such id:${contactId}`);
      return;
    }
  } catch (error) {
    handleError(error);
  }
}

async function addContact(name, email, phone) {
  try {
    const res = await fs.readFile(contactsPath);
    const contacts = JSON.parse(res);

    contacts.push({ id: uuidv4(), name, email, phone });

    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    console.log('Contact added!');
  } catch (error) {
    handleError(error);
  }
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
