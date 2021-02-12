import * as fs from 'fs/promises';
import path from 'path';
import getFileDirName from '../lib/dirname.js';
import { handleError } from '../lib/handlerror.js';

const { __dirname } = getFileDirName(import.meta.url);
const contactsPath = path.join(__dirname, '..', 'db', 'contacts.json');

async function listContacts() {
  try {
    const res = await fs.readFile(contactsPath);
    console.table(JSON.parse(res));
  } catch (error) {
    handleError(error);
  }
}

async function getContactById(contactId) {
  try {
    const res = await fs.readFile(contactsPath);
    const data = JSON.parse(res);
    const contact = data.filter(contact => contact.id === contactId);
    console.table(...contact);
  } catch (error) {
    handleError(error);
  }
}

async function removeContact(contactId) {
  try {
    const res = await fs.readFile(contactsPath);
    const data = JSON.parse(res);
    const contacts = data.filter(contact => contact.id !== contactId);
    if (contacts.length === data.length) {
      console.log('No contacts with such id');
      return;
    } else {
      fs.writeFile(contactsPath, JSON.stringify(contacts));
      console.log('Contact removed!');
    }
  } catch (error) {
    handleError(error);
  }
}

async function addContact(name, email, phone) {
  try {
    const res = await fs.readFile(contactsPath);
    const data = JSON.parse(res);
    const contacts = data.filter(contact => contact.id !== contactId);
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
