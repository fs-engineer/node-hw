import express from 'express';
import userController from '../contollers/user-controllers.js';
import validateUser from '../service/user-validation.js';
import tokenValidation from '../service/token-validation.js';

const router = express.Router();

router.post('/auth/register', validateUser, userController.createUser);

router.get('/auth/login', validateUser, userController.login);

router.get('/auth/logout', tokenValidation, userController.logout);

export default router;
