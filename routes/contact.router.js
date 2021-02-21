import express from 'express';
import validationId from '../service/id-validation.js';
import contactValidation from '../service/contact-validation.js';
import contactController from '../contollers/contact-controllers.js';
import tokenValidation from '../service/token-validation.js';

const router = express.Router();

router.get('/', tokenValidation, contactController.listContacts);

router.post(
  '/',
  tokenValidation,
  contactValidation,
  contactController.addContact,
);

router.get(
  '/:contactId',
  tokenValidation,
  validationId,
  contactController.getContactById,
);

router.delete(
  '/:contactId',
  tokenValidation,
  validationId,
  contactController.removeContact,
);

router.patch(
  '/:contactId',
  tokenValidation,
  validationId,
  contactController.updateContact,
);

export default router;
