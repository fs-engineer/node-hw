import express from 'express';
import userController from '../contollers/user-controllers.js';
import validationId from '../lib/validationId.js';

const router = express.Router();

router.get('/', userController.listContacts);

router.get('/:userId', validationId, userController.getContactById);

router.post('/', userController.addContact);

router.delete('/:userId', validationId, userController.removeContact);

router.patch('/:userId', validationId, userController.updateContact);

export default router;
