import express from 'express';

import userController from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/').get(protect, userController.readUsers);

export default router;
