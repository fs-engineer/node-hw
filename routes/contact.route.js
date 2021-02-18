import express from 'express';
import ctrlContact from '../contollers/contact-controllers.js';
import ctrlValidation from '../contollers/contact-validation.js';

const router = express.Router();

router.get('/', ctrlContact.listContacts);

router.get(
  '/:contactId',
  ctrlValidation.validateContactId,
  ctrlContact.getContactById,
);

router.post('/', ctrlContact.addContact);

router.delete('/:contactId', ctrlContact.removeContact);

router.patch(
  '/:contactId',

  ctrlContact.updateContact,
);

export default router;
