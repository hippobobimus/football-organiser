import express from 'express';

import userController from '../controllers/userController';

const router = express.Router();

router
  .route('/')
  .get(userController.readUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.readUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

router
  .route('/login')
  .post(userController.loginUser);

export default router;
