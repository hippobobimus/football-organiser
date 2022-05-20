import express from 'express';

import userController from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

router
  .route('/')
  .get(protect, userController.readUsers)
  .post(userController.createUser);

router
  .route('/login')
  .post(userController.loginUser);

router
  .route('/me')
  .get(protect, userController.readCurrentUser)
  .put(protect, userController.updateCurrentUser)

// TODO currently unused
//
// router
//   .route('/:id')
//   .get(userController.readUser)
//   .put(userController.updateUser)
//   .delete(userController.deleteUser);

export default router;
