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
  .route('/:id/attendees')
  .get(protect, eventController.readAttendees);

router
  .route('/:id/attendees/me')
  .post(protect, eventController.createAuthUserAttendee)
  .get(protect, eventController.readAuthUserAttendee)
  .put(protect, eventController.updateAuthUserAttendee)
  .delete(protect, eventController.deleteAuthUserAttendee);

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
