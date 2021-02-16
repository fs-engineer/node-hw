import express from 'express';
import contactControllers from '../contollers/contact-controllers.js';
import contactController from '../contollers/contact-controllers.js';

const router = express.Router();

router.get('/', (req, res) => contactController.listContacts(req, res));

router.get('/:contactId', (req, res) =>
  contactController.getContactById(req, res),
);

router.post('/', contactController.validateContact, (req, res) =>
  contactController.addContact(req, res),
);

router.delete('/:contactId', (req, res) =>
  contactController.removeContact(req, res),
);

router.patch(
  '/:contactId',
  contactControllers.validateUpdateContact,
  (req, res) => contactController.updateContact(req, res),
);

export default router;
