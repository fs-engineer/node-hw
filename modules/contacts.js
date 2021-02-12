import * as fs from 'fs/promises';
import { pathToFileURL } from 'url';

const contactsPath = pathToFileURL('../db/contacts.json');
console.log(contactsPath.pathname);
// TODO: задокументировать каждую функцию
function listContacts() {
  fs.readFile(contactsPath);
}

function getContactById(contactId) {
  // ...твой код
}

function removeContact(contactId) {
  // ...твой код
}

function addContact(name, email, phone) {
  // ...твой код
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
