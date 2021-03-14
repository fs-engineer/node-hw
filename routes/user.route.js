import express from 'express';
import userController from '../contollers/user-controllers.js';
import validateUser from '../service/user-validation.js';
import tokenValidation from '../service/token-validation.js';
import uploadAvatarToCloud from '../service/convertAndUploadAvatar.js';

const router = express.Router();

router.post('/auth/register', validateUser, userController.createUser);

router.get('/auth/login', validateUser, userController.login);

router.post('/auth/logout', tokenValidation, userController.logout);

router.get('/current', tokenValidation, userController.currentUser);

router.patch('/avatars', tokenValidation, userController.avatar);

export default router;
