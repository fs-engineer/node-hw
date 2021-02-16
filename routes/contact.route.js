import express from 'express';
import contactControllers from '../contollers/contact-controllers.js';
import contactController from '../contollers/contact-controllers.js';
import contacts from '../modules/contacts.js';

const router = express.Router();

router.get('/', (req, res, next) => contactController.listContacts(req, res));

router.get('/:contactId', (req, res, next) =>
  contactController.getContactById(req, res),
);

router.post('/', contactController.validateContact, (req, res) =>
  contactController.addContact(req, res),
);

router.delete('/:contactId', (req, res, next) =>
  contactController.removeContact(req, res),
);

router.patch(
  '/:contactId',
  contactControllers.validateUpdateContact,
  (req, res) => contactController.updateContact(req, res),
);

export default router;
