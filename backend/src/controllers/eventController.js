import { validateEvent, processValidation } from '../middleware/validation';
import * as eventServices from '../services/eventServices';

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const readEvents = async (req, res, next) => {
  try {
    let results = await eventServices.getEvents(req.user.id, req.query);
    return res.status(200).json(results);
  } catch (err) {
    return next(err);
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private, admin only
const createEvent = [
  validateEvent.buildUpTime(),
  validateEvent.startTime(),
  validateEvent.endTime(),
  validateEvent.category(),
  validateEvent.name().optional({ checkFalsy: true }),
  validateEvent.locationName().optional({ checkFalsy: true }),
  validateEvent.locationLine1(),
  validateEvent.locationLine2().optional({ checkFalsy: true }),
  validateEvent.locationTown(),
  validateEvent.locationPostcode(),
  validateEvent.capacity().optional({ checkFalsy: true }),
  processValidation,
  async (req, res, next) => {
    try {
      const event = await eventServices.createEvent(req.user.id, req.body);
      return res.status(200).json(event);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Get an event
// @route   GET /api/events/:eventId
// @access  Private
const readEvent = [
  validateEvent.eventId(),
  processValidation,
  async (req, res, next) => {
    try {
      const event = await eventServices.getEvent(
        req.user.id,
        req.params.eventId
      );
      return res.status(200).json(event);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Retrieve the chronologically next upcoming event of type 'match'
// @route   GET /api/events/next-match
// @access  Private
const readNextMatch = async (req, res, next) => {
  try {
    const nextMatch = await eventServices.getNextMatch(req.user.id);
    return res.status(200).json(nextMatch);
  } catch (err) {
    return next(err);
  }
};

// @desc    Edit event
// @route   PATCH /api/events/:eventId
// @access  Private, admin only
const updateEvent = [
  validateEvent.eventId(),
  validateEvent.buildUpTime().optional({ checkFalsy: true }),
  validateEvent.startTime().optional({ checkFalsy: true }),
  validateEvent.endTime().optional({ checkFalsy: true }),
  validateEvent.category().optional({ checkFalsy: true }),
  validateEvent.name().optional({ checkFalsy: true }),
  validateEvent.locationName().optional({ checkFalsy: true }),
  validateEvent.locationLine1().optional({ checkFalsy: true }),
  validateEvent.locationLine2().optional({ checkFalsy: true }),
  validateEvent.locationTown().optional({ checkFalsy: true }),
  validateEvent.locationPostcode().optional({ checkFalsy: true }),
  validateEvent.capacity().optional({ checkFalsy: true }),
  validateEvent.isCancelled().optional({ checkFalsy: false }),
  processValidation,
  async (req, res, next) => {
    try {
      const event = await eventServices.updateEvent(
        req.user.id,
        req.params.eventId,
        req.body
      );
      return res.status(200).json(event);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Delete an event
// @route   DELETE /api/events/:eventId
// @access  Private, admin only
const deleteEvent = [
  validateEvent.eventId(),
  processValidation,
  async (req, res, next) => {
    try {
      const event = await eventServices.deleteEvent(
        req.user.id,
        req.params.eventId
      );
      return res.status(200).json(event);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Register the authenticated user for an event
// @route   POST /api/events/:eventId/attendees/me
// @access  Private
const createAuthUserAttendee = [
  validateEvent.eventId(),
  processValidation,
  async (req, res, next) => {
    try {
      const updatedEvent = await eventServices.createAttendee(
        req.user.id,
        req.user.id,
        req.params.eventId,
        false
      );
      return res.status(200).json(updatedEvent);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Update the authenticated user's attendance to the given event.
// @route   PATCH /api/events/:eventId/attendees/me
// @access  Private
const updateAuthUserAttendee = [
  validateEvent.eventId(),
  validateEvent.guests().optional({ checkFalsy: true }),
  processValidation,
  async (req, res, next) => {
    try {
      const updatedEvent = await eventServices.updateAttendee(
        req.user.id,
        req.user.id,
        req.params.eventId,
        req.body,
        false
      );
      return res.status(200).json(updatedEvent);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    De-register the authenticated user from an event
// @route   DELETE /api/events/:eventId/attendees/me
// @access  Private
const deleteAuthUserAttendee = [
  validateEvent.eventId(),
  processValidation,
  async (req, res, next) => {
    try {
      const updatedEvent = await eventServices.deleteAttendee(
        req.user.id,
        req.user.id,
        req.params.eventId,
        false
      );
      return res.status(200).json(updatedEvent);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Create an attendance record for the given user and event
// @route   POST /api/events/:eventId/attendees/:userId
// @access  Private, admin only
const createAttendee = [
  validateEvent.eventId(),
  validateEvent.userId(),
  validateEvent.guests().optional({ checkFalsy: true }),
  processValidation,
  async (req, res, next) => {
    try {
      const updatedEvent = await eventServices.createAttendee(
        req.user.id,
        req.params.userId,
        req.params.eventId,
        true
      );
      return res.status(200).json(updatedEvent);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Update the attendance record for the given user and event
// @route   PATCH /api/events/:eventId/attendees/:userId
// @access  Private, admin only
const updateAttendee = [
  validateEvent.eventId(),
  validateEvent.userId(),
  validateEvent.guests().optional({ checkFalsy: true }),
  processValidation,
  async (req, res, next) => {
    try {
      const updatedEvent = await eventServices.updateAttendee(
        req.user.id,
        req.params.userId,
        req.params.eventId,
        req.body,
        true
      );
      return res.status(200).json(updatedEvent);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Remove the given attendee record
// @route   DELETE /api/events/:eventId/attendees/:userId
// @access  Private, admin only
const deleteAttendee = [
  validateEvent.eventId(),
  validateEvent.userId(),
  processValidation,
  async (req, res, next) => {
    try {
      const updatedEvent = await eventServices.deleteAttendee(
        req.user.id,
        req.params.userId,
        req.params.eventId,
        true
      );
      return res.status(200).json(updatedEvent);
    } catch (err) {
      return next(err);
    }
  },
];

export default {
  readEvents,
  createEvent,
  readEvent,
  readNextMatch,
  updateEvent,
  deleteEvent,
  createAuthUserAttendee,
  updateAuthUserAttendee,
  deleteAuthUserAttendee,
  createAttendee,
  updateAttendee,
  deleteAttendee,
};
