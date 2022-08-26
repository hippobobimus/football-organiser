import express from 'express';

import eventController from '../controllers/eventController';
import { protect, protectAdmin } from '../middleware/auth';

const router = express.Router();

router
  .route('/')
  .get(protect, eventController.readEvents)
  .post(protectAdmin, eventController.createEvent);

router.route('/next-match').get(protect, eventController.readNextMatch);

router
  .route('/:eventId')
  .get(protect, eventController.readEvent)
  .patch(protectAdmin, eventController.updateEvent)
  .delete(protectAdmin, eventController.deleteEvent);

router
  .route('/:eventId/attendees/me')
  .post(protect, eventController.createAuthUserAttendee)
  .patch(protect, eventController.updateAuthUserAttendee)
  .delete(protect, eventController.deleteAuthUserAttendee);

router
  .route('/:eventId/attendees/:userId')
  .post(protectAdmin, eventController.createAttendee)
  .patch(protectAdmin, eventController.updateAttendee)
  .delete(protectAdmin, eventController.deleteAttendee);

export default router;
