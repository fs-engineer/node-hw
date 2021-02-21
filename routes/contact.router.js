import express from 'express';
import validationId from '../service/id-validation.js';
import contactValidation from '../service/contact-validation.js';
import contactController from '../contollers/contact-controllers.js';

const router = express.Router();

router.get('/', contactController.listContacts);

router.post('/', contactValidation, contactController.addContact);

router.get('/:contactId', validationId, contactController.getContactById);

router.delete('/:contactId', validationId, contactController.removeContact);

router.patch('/:contactId', validationId, contactController.updateContact);

export default router;
