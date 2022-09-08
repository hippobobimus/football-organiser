import express from 'express';

import authController from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/login').post(authController.login);

router.route('/logout').post(authController.logout);

router.route('/register').post(authController.register);

router.route('/refresh').get(authController.refresh);

router
  .route('/user')
  .get(protect, authController.readAuthUser)
  .patch(protect, authController.updateAuthUser);

export default router;
