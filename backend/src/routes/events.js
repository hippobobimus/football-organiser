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
  .put(protectAdmin, eventController.updateEvent)
  .delete(protectAdmin, eventController.deleteEvent);

router
  .route('/:id/attendees/me')
  .post(protect, eventController.createAuthUserAttendee)
  .put(protect, eventController.updateAuthUserAttendee)
  .delete(protect, eventController.deleteAuthUserAttendee);

router
  .route('/:eventId/attendees/:userId')
// TODO
//  .post(protectAdmin, eventController.createAttendee)
  .put(protectAdmin, eventController.updateAttendee)
  .delete(protectAdmin, eventController.deleteAttendee);

export default router;
