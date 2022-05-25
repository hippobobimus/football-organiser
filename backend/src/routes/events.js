import express from 'express';

import eventController from '../controllers/eventController';
import { protect } from '../middleware/auth';

const router = express.Router();

router
  .route('/')
  .get(protect, eventController.readEvents);

router
  .route('/next-match')
  .get(protect, eventController.readNextMatch);

router
  .route('/:id/join')
  .put(protect, eventController.joinEvent);

router
  .route('/:id/leave')
  .put(protect, eventController.leaveEvent);

router
  .route('/:id/attendees')
  .get(protect, eventController.readAttendees);

router
  .route('/:id/attendees/me')
  .get(protect, eventController.readCurrentUserAttendee);

// TODO currently unused
//
// router
//   .route('/')
//   .get(protect, eventController.readEvents)
//   .post(eventController.createEvent);
// 
// router
//   .route('/:id')
//   .get(eventController.readEvent)
//   .put(eventController.updateEvent)
//   .delete(eventController.deleteEvent);
// 

export default router;
