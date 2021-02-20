import express from 'express';
import userController from '../contollers/user-controllers.js';
import validationId from '../service/validationId.js';
import validateUser from '../service/user-validation.js';
import contactController from '../contollers/contact-controller.js';
import tokenValidation from '../service/token-validation.js';

const router = express.Router();

router.get('/', contactController.listContacts);

router.get('/:contactId', validationId, contactController.getContactById);

router.delete('/:contactId', validationId, contactController.removeContact);

router.patch('/:contactId', validationId, contactController.updateContact);

export default router;
