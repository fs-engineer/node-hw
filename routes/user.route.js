import express from 'express';
import userController from '../contollers/user-controllers.js';
import validationId from '../service/validationId.js';
import validateNewUser from '../service/user-validation.js';

const router = express.Router();

router.get('/', userController.listUser);

router.get('/:userId', validationId, userController.getUserById);

router.post('/auth/register', validateNewUser, userController.addUser);

router.delete('/:userId', validationId, userController.removeUser);

router.patch('/:userId', validationId, userController.updateUser);

export default router;
