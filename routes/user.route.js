import express from 'express';
import userController from '../contollers/user-controllers.js';
import validationId from '../service/validationId.js';
import validateUser from '../service/user-validation.js';
import tokenValidation from '../service/token-validation.js';

const router = express.Router();

router.get('/', tokenValidation, userController.listUser);

router.post('/auth/register', validateUser, userController.createUser);

router.get('/auth/login', validateUser, userController.login);

router.get('/auth/logout', tokenValidation, userController.logout);

router.get('/:userId', validationId, userController.getUserById);

router.delete('/:userId', validationId, userController.removeUser);

router.patch('/:userId', validationId, userController.updateUser);

export default router;
