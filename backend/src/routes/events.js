import express from 'express';

import eventController from '../controllers/eventController';
import { protect, protectAdmin } from '../middleware/auth';

const router = express.Router();

router
  .route('/')
  .get(protect, eventController.readEvents)
  .post(protectAdmin, eventController.createEvent);

router
  .route('/next-match')
  .get(protect, eventController.readNextMatch);

router
  .route('/:id')
  .get(protect, eventController.readEvent)
  .put(protectAdmin, eventController.updateEvent);

router
  .route('/:id/attendees/me')
  .post(protect, eventController.createAuthUserAttendee)
  .put(protect, eventController.updateAuthUserAttendee)
  .delete(protect, eventController.deleteAuthUserAttendee);

// TODO currently unused
// 
// router
//   .route('/:id/attendees')
//   .post(protectAdmin, eventController.createEventAttendee)
//
// router
//   .route('/:id/attendees/:attendeeId')
//   .put(protectAdmin, eventController.updateEventAttendee)
//   .delete(protectAdmin, eventController.deleteEventAttendee)
//
// router
//   .route('/:id')
//   .delete(eventController.deleteEvent);

export default router;
