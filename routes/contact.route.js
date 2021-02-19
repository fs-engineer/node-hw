import express from 'express';
import ctrlContact from '../contollers/contact-controllers.js';
import validationId from '../lib/validationId.js';

const router = express.Router();

router.get('/', ctrlContact.listContacts);

router.get('/:contactId', validationId, ctrlContact.getContactById);

router.post('/', ctrlContact.addContact);

router.delete('/:contactId', validationId, ctrlContact.removeContact);

router.patch('/:contactId', validationId, ctrlContact.updateContact);

export default router;
