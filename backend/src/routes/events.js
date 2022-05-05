import express from 'express';

import eventController from '../controllers/eventController';
import { protect } from '../middleware/auth';

const router = express.Router();

router
  .route('/')
  .get(protect, eventController.readEvents)
  .post(eventController.createEvent);

router
  .route('/:id')
  .get(eventController.readEvent)
  .put(eventController.updateEvent)
  .delete(eventController.deleteEvent);

router
  .route('/:id/join')
  .put(eventController.joinEvent);

router
  .route('/:id/leave')
  .put(eventController.leaveEvent);

export default router;
