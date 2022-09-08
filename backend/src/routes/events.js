import express from 'express';

import eventController from '../controllers/eventController';
import { parseEventId } from '../middleware/idParser';
import { protect, protectAdmin } from '../middleware/auth';

const router = express.Router();

router
  .route('/')
  .get(protect, eventController.readEvents)
  .post(protectAdmin, eventController.createEvent);

router
  .route('/:eventId')
  .get(protect, parseEventId, eventController.readEvent)
  .patch(protectAdmin, parseEventId, eventController.updateEvent)
  .delete(protectAdmin, parseEventId, eventController.deleteEvent);

router
  .route('/:eventId/attendees/me')
  .post(protect, parseEventId, eventController.createAuthUserAttendee)
  .patch(protect, parseEventId, eventController.updateAuthUserAttendee)
  .delete(protect, parseEventId, eventController.deleteAuthUserAttendee);

router
  .route('/:eventId/attendees/:userId')
  .post(protectAdmin, parseEventId, eventController.createAttendee)
  .patch(protectAdmin, parseEventId, eventController.updateAttendee)
  .delete(protectAdmin, parseEventId, eventController.deleteAttendee);

export default router;
