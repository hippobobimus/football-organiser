import express from 'express';

import eventController from '../controllers/eventController';

const router = express.Router();

router
  .route('/')
  .get(eventController.readEvents)
  .post(eventController.createEvent);

router
  .route('/:id')
  .get(eventController.readEvent)
  .put(eventController.updateEvent)
  .delete(eventController.deleteEvent);

export default router;
