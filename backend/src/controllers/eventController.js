import mongoose from 'mongoose';
import createError from 'http-errors';

import { Attendee, Event, User } from '../models';
import { validateEvent, processValidation } from '../middleware/validation';
import * as eventServices from '../services/eventServices';

/*
 * Helper functions
 */

const populateEvent = async (event, authUserId) => {
  await event.populate('numAttendees');
  await event.populate({
    path: 'attendees',
    populate: {
      path: 'user',
      select: ['firstName', 'lastName'],
    },
  });

  // determine whether the auth user is registered for this event and, if so,
  // attach their attendee separately.
  const authUserAttendee = event.attendees?.find((attendee) => {
    return attendee.user.id === authUserId;
  });

  event.set('authUserAttendee', authUserAttendee || null, {
    strict: false,
  });

  return event;
};

const getPopulatedEvent = async (eventId, authUserId) => {
  let event = await Event.findById(eventId);

  if (!event) {
    throw createError(400, 'Event not found.');
  }

  await populateEvent(event, authUserId);

  return event;
};

/*
 * Exported functions
 */

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
// @route   PUT /api/events/:eventId
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
    let event;
    try {
      event = await Event.findById(req.params.eventId);
    } catch (err) {
      return next(err);
    }

    if (!event) {
      return next(createError(404, 'Event not found'));
    }

    // whitelist request body.
    if (req.body.buildUpTime) {
      event.time.buildUp = req.body.buildUpTime;
    }
    if (req.body.startTime) {
      event.time.start = req.body.startTime;
    }
    if (req.body.endTime) {
      event.time.end = req.body.endTime;
    }
    if (req.body.category) {
      event.category = req.body.category;
    }
    if (req.body.name) {
      event.name = req.body.name;
    }
    if (req.body.locationName) {
      event.location.name = req.body.locationName;
    }
    if (req.body.locationLine1) {
      event.location.line1 = req.body.locationLine1;
    }
    if (req.body.locationLine2) {
      event.location.line2 = req.body.locationLine2;
    }
    if (req.body.locationTown) {
      event.location.town = req.body.locationTown;
    }
    if (req.body.locationPostcode) {
      event.location.postcode = req.body.locationPostcode;
    }
    if (req.body.capacity) {
      event.capacity = req.body.capacity;
    }
    if (typeof req.body.isCancelled !== 'undefined') {
      event.isCancelled = req.body.isCancelled;
    }

    try {
      event = await event.save();

      event = await populateEvent(event, req.user.id);

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
    let event;
    try {
      event = await Event.findByIdAndDelete(req.params.eventId);
      // remove related attendee records.
      await Attendee.deleteMany({ event: req.params.eventId });
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
    let event;
    let attendee;
    try {
      event = await Event.findById(req.params.eventId);
      attendee = await Attendee.findOne({
        user: req.user.id,
        event: req.params.eventId,
      });
    } catch (err) {
      return next(err);
    }

    if (!event) {
      return next(createError(404, 'Event not found'));
    }

    if (attendee) {
      return next(
        createError(400, 'Cannot join event, you are already registered.')
      );
    }

    if (event.isFinished) {
      return next(createError(400, 'This event has finished.'));
    }
    if (event.isCancelled) {
      return next(createError(400, 'This event has been cancelled.'));
    }
    if (event.isFull) {
      return next(createError(400, 'This event is full.'));
    }

    attendee = new Attendee({
      event: new mongoose.Types.ObjectId(req.params.eventId),
      user: new mongoose.Types.ObjectId(req.user.id),
      guests: 0,
    });

    try {
      attendee = await attendee.save();
    } catch (err) {
      return next(err);
    }

    try {
      const updatedEvent = await getPopulatedEvent(
        req.params.eventId,
        req.user.id
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
    let event;
    let attendee;
    try {
      event = await Event.findById(req.params.eventId);
      attendee = await Attendee.findOne({
        user: req.user.id,
        event: req.params.eventId,
      });
    } catch (err) {
      return next(err);
    }

    if (!event) {
      return next(createError(404, 'Event not found'));
    }

    if (!attendee) {
      return next(
        createError(
          409,
          'You cannot de-register from an event you are not already registered for.'
        )
      );
    }

    if (event.isFinished) {
      return next(createError(400, 'This event has finished.'));
    }
    if (event.isCancelled) {
      return next(createError(400, 'This event has been cancelled.'));
    }

    // Remove attendee document from collection.
    try {
      attendee = await Attendee.findByIdAndDelete(attendee.id);
    } catch (err) {
      return next(err);
    }

    try {
      const updatedEvent = await getPopulatedEvent(
        req.params.eventId,
        req.user.id
      );
      return res.status(200).json(updatedEvent);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Update the authenticated user's attendance to the given event.
// @route   PUT /api/events/:eventId/attendees/me
// @access  Private
const updateAuthUserAttendee = [
  validateEvent.eventId(),
  validateEvent.guests().optional({ checkFalsy: true }),
  processValidation,
  async (req, res, next) => {
    let event;
    let attendee;
    try {
      event = await Event.findById(req.params.eventId);
      attendee = await Attendee.findOne({
        user: req.user.id,
        event: req.params.eventId,
      });
    } catch (err) {
      return next(err);
    }

    if (!event) {
      return next(createError(404, 'Event not found'));
    }

    if (!attendee) {
      return next(createError(409, 'You are not registered for this event.'));
    }

    if (event.isFinished) {
      return next(createError(400, 'This event has finished.'));
    }
    if (event.isCancelled) {
      return next(createError(400, 'This event has been cancelled.'));
    }
    if (event.isFull) {
      return next(createError(400, 'This event is full.'));
    }

    if (req.body.guests >= 0) {
      attendee.guests = req.body.guests;
    }

    try {
      attendee = await attendee.save();
    } catch (err) {
      return next(err);
    }

    try {
      const updatedEvent = await getPopulatedEvent(
        req.params.eventId,
        req.user.id
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
    let attendee;
    try {
      attendee = await Attendee.findOne({
        user: req.params.userId,
        event: req.params.eventId,
      });
    } catch (err) {
      return next(err);
    }

    if (attendee) {
      return next(
        createError(400, 'The user is already registered for this event')
      );
    }

    let event;
    try {
      event = await getPopulatedEvent(req.params.eventId, req.params.userId);
    } catch (err) {
      return next(err);
    }

    if (!event) {
      return next(createError(404, 'Event not found'));
    }

    if (event.isFull) {
      return next(createError(400, 'Event is full'));
    }

    let user;
    try {
      user = await User.findById(req.params.userId);
    } catch (err) {
      return next(err);
    }

    if (!user) {
      return next(createError(404, 'User not found'));
    }

    try {
      await Attendee.create({
        user: req.params.userId,
        event: req.params.eventId,
        guests: req.body?.guests || 0,
      });

      const updatedEvent = await getPopulatedEvent(
        req.params.eventId,
        req.user.id
      );
      return res.status(200).json(updatedEvent);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Update the attendance record for the given user and event
// @route   PUT /api/events/:eventId/attendees/:userId
// @access  Private, admin only
const updateAttendee = [
  validateEvent.eventId(),
  validateEvent.userId(),
  validateEvent.guests().optional({ checkFalsy: true }),
  processValidation,
  async (req, res, next) => {
    let attendee;
    try {
      attendee = await Attendee.findOne({
        user: req.params.userId,
        event: req.params.eventId,
      });
    } catch (err) {
      return next(err);
    }

    if (!attendee) {
      return next(createError(404, 'Attendance record not found'));
    }

    if (req.body.guests >= 0) {
      attendee.guests = req.body.guests;
    }

    try {
      attendee = await attendee.save();
    } catch (err) {
      return next(err);
    }

    try {
      const updatedEvent = await getPopulatedEvent(
        req.params.eventId,
        req.user.id
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
    let attendee;
    try {
      attendee = await Attendee.findOneAndDelete({
        user: req.params.userId,
        event: req.params.eventId,
      });
    } catch (err) {
      return next(err);
    }

    if (!attendee) {
      return next(createError(404, 'Attendance record not found'));
    }

    try {
      const updatedEvent = await getPopulatedEvent(
        req.params.eventId,
        req.user.id
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
