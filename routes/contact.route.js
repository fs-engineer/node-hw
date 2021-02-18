import express from 'express';
import ctrlContact from '../contollers/contact-controllers.js';
import ctrlValidation from '../contollers/contact-validation.js';

const router = express.Router();

router.get('/', ctrlContact.listContacts);

router.get('/:contactId', ctrlContact.getContactById);

router.post('/', ctrlValidation.validateContact, ctrlContact.addContact);

router.delete('/:contactId', ctrlContact.removeContact);

router.patch(
  '/:contactId',
  ctrlValidation.validateUpdateContact,
  ctrlContact.updateContact,
);

export default router;
