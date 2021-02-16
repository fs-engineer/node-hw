import * as fs from 'fs/promises';
import path from 'path';
import getFileDirName from '../lib/dirname.js';
import { handleError } from '../lib/handlerror.js';
import { v4 as uuidv4 } from 'uuid';

const { __dirname } = getFileDirName(import.meta.url);
const contactsPath = path.join(__dirname, '../db/contacts.json');

// async function listContacts() {
//   try {
//     const res = await fs.readFile(contactsPath);
//     console.table(JSON.parse(res));

//     return JSON.parse(res);
//   } catch (error) {
//     handleError(error);
//   }
// }

// async function getContactById(contactId) {
//   try {
//     const res = await fs.readFile(contactsPath);
//     const data = JSON.parse(res);
//     const contact = data.filter(contact => contact.id === contactId);

//     if (contact.length === 0) {
//       console.log(`Id:${contactId} not found!`);
//       return `Id:${contactId} not found!`;
//     } else {
//       console.table(contact);
//       return contact;
//     }
//   } catch (error) {
//     handleError(error);
//   }
// }

// async function removeContact(contactId) {
//   console.log(contactId);
//   try {
//     const res = await fs.readFile(contactsPath);
//     const data = JSON.parse(res);
//     const contacts = data.filter(contact => contact.id !== contactId);

//     if (contacts.length !== data.length) {
//       fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

//       console.log(`Contact with id: ${contactId} removed!`);

//       return `Contact with id: ${contactId} removed!`;
//     } else {
//       console.log(`No contacts with such id:${contactId}`);
//       return `No contacts with such id:${contactId}`;
//     }
//   } catch (error) {
//     handleError(error);
//   }
// }

// async function addContact(name, email, phone) {
//   try {
//     const res = await fs.readFile(contactsPath);
//     const contacts = JSON.parse(res);
//     const newContact = { id: uuidv4(), name, email, phone };

//     contacts.push(newContact);

//     fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

//     console.log('Contact added!');

//     return newContact;
//   } catch (error) {
//     handleError(error);
//   }
// }

async function updateContact(data) {
  try {
    const res = await fs.readFile(contactsPath);
    const contacts = JSON.parse(res);

    const contactIndex = contacts.findIndex(({ id }) => id === data.id);

    const updateContact = {
      ...contacs[contactIndex],
      ...data.body,
    };

    contacts[contactIndex] = updateContact;

    fs.writeFile(contactsPath, JSON.stringify(putchedContacts, null, 2));

    return putchedContacts;
  } catch (error) {
    handleError(error);
  }
}

// async function updateContact(data) {
//   try {
//     const res = await fs.readFile(contactsPath);
//     const contacts = JSON.parse(res);

//     const putchedContacts = contacts.map(contact => {
//       if (contact.id === data.id) {
//         if (data.name && contact.name !== data.name) contact.name = data.name;
//         if (data.email && contact.email !== data.email)
//           contact.email = data.email;
//         if (data.phone && contact.phone !== data.phone)
//           contact.phone = data.phone;
//       }
//       return contact;
//     });

//     fs.writeFile(contactsPath, JSON.stringify(putchedContacts, null, 2));

//     return putchedContacts;
//   } catch (error) {
//     handleError(error);
//   }
// }

export default {
  // listContacts,
  // getContactById,
  // removeContact,
  // addContact,
  // updateContact,
};
