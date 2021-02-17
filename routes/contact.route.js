import express from 'express';
import contactControllers from '../contollers/contact-controllers.js';

const router = express.Router();

router.get('/', contactControllers.listContacts);

router.get('/:contactId', contactControllers.getContactById);

router.post(
  '/',
  contactControllers.validateContact,
  contactControllers.addContact,
);

router.delete('/:contactId', contactControllers.removeContact);

router.patch(
  '/:contactId',
  contactControllers.validateUpdateContact,
  contactControllers.updateContact,
);

export default router;
