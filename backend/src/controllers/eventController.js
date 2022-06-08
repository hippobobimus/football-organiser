import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import createError from 'http-errors';

import { Attendee, Event } from '../models';
import validate from '../middleware/validation/eventValidation';

const { ObjectId } = mongoose.Types;

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
    sort: { 'user.name': 'asc' },
  });

  // determine whether the auth user is registered for this event and, if so, attach their attendee
  // separately.
  const authUserAttendee = event.attendees?.find((attendee) => {
    return attendee.user.id === authUserId;
  });

  event.set('authUserAttendee', authUserAttendee || null, {
    strict: false,
  });

  return event;
};

const getPopulatedEvent = async (eventId, authUserId) => {
  let event = await Event.findById(eventId)
    .populate('numAttendees')
    .populate({
      path: 'attendees',
      populate: {
        path: 'user',
        select: ['firstName', 'lastName'],
      },
      sort: { 'user.name': 'asc' },
    });

  if (!event) {
    throw createError(400, 'Event not found.');
  }

  // determine whether the auth user is registered for this event and, if so, attach their attendee
  // separately.
  const authUserAttendee = event.attendees?.find((attendee) => {
    return attendee.user.id === authUserId;
  });

  event.set('authUserAttendee', authUserAttendee || null, {
    strict: false,
  });

  return event;
};

/*
 * Exported functions
 */

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const readEvents = async (req, res, next) => {
  const page = req.query?.page > 0 ? req.query.page : 1;

  let options = {
    page,
    limit: 4,
    populate: [
      'numAttendees',
      {
        path: 'attendees',
        populate: {
          path: 'user',
          select: ['firstName', 'lastName'],
        },
      },
    ],
  };

  let query;

  if (req.query?.finished.toLowerCase() === 'true') {
    // past events.
    query = {
      'time.end': { $lt: Date.now() },
    };
    // show most recent first.
    options.sort = { 'time.start': 'desc' };
  } else {
    // upcoming and in-progress events.
    query = {
      'time.end': { $gte: Date.now() },
    };
    // show most recent first.
    options.sort = { 'time.start': 'asc' };
  }

  try {
    let results = await Event.paginate(query, options);

    // identify the attendee associated with the auth user and add as an extra field.
    results.docs = results.docs.map((event) => {
      const authUserAttendee = event.attendees?.find((attendee) => {
        return attendee.user.id === req.user.id;
      });

      event.set('authUserAttendee', authUserAttendee || null, {
        strict: false,
      });

      return event;
    });

    return res.status(200).json(results);
  } catch (err) {
    return next(err);
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private, admin only
const createEvent = [
  validate.buildUpTime(),
  validate.startTime(),
  validate.endTime(),
  validate.category(),
  validate.name().optional({ checkFalsy: true }),
  validate.locationName().optional({ checkFalsy: true }),
  validate.locationLine1(),
  validate.locationLine2().optional({ checkFalsy: true }),
  validate.locationTown(),
  validate.locationPostcode(),
  validate.capacity().optional({ checkFalsy: true }),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const msg = errors.errors
        .map((err) => `'${err.param}': ${err.msg}`)
        .join(' ');
      return next(
        createError(400, 'Field validation failed. ' + msg, {
          fieldValidationErrors: errors.errors,
        })
      );
    }

    try {
      const event = await Event.create({
        category: req.body.category,
        name: req.body.name || 'Event',
        time: {
          buildUp: req.body.buildUpTime,
          start: req.body.startTime,
          end: req.body.endTime,
        },
        location: {
          name: req.body.locationName || '',
          line1: req.body.locationLine1,
          line2: req.body.locationLine2 || '',
          town: req.body.locationTown,
          postcode: req.body.locationPostcode,
        },
        capacity: req.body.capacity || -1,
      });
      return res.status(200).json(event);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Get an event
// @route   GET /api/events/:id
// @access  Private
const readEvent = async (req, res, next) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return next(createError(400, 'Invalid event id.'));
  }

  let event;
  try {
    event = await Event.findById(req.params.id)
      .populate('numAttendees')
      .populate({
        path: 'attendees',
        populate: {
          path: 'user',
          select: ['firstName', 'lastName'],
        },
        sort: { 'user.name': 'asc' },
      });
  } catch (err) {
    return next(err);
  }

  if (!event) {
    return next(createError(400, 'Event not found.'));
  }

  // determine whether the auth user is registered for this event and, if so, attach their attendee
  // separately.
  const authUserAttendee = event.attendees?.find((attendee) => {
    return attendee.user.id === req.user.id;
  });

  event.set('authUserAttendee', authUserAttendee || null, {
    strict: false,
  });

  return res.status(200).json(event);
};

// @desc    Retrieve the next event of type 'match' in chronological order
// @route   GET /api/events/next-match
// @access  Private
const readNextMatch = async (req, res, next) => {
  try {
    // TODO find the appropriate event and populate.
    const nextMatch = await Event.findOne();

    return res.status(200).json(nextMatch);
  } catch (err) {
    return next(err);
  }
};

// @desc    Edit event
// @route   PUT /api/events/:id
// @access  Private, admin only
const updateEvent = [
  validate.buildUpTime().optional({ checkFalsy: true }),
  validate.startTime().optional({ checkFalsy: true }),
  validate.endTime().optional({ checkFalsy: true }),
  validate.category().optional({ checkFalsy: true }),
  validate.name().optional({ checkFalsy: true }),
  validate.locationName().optional({ checkFalsy: true }),
  validate.locationLine1().optional({ checkFalsy: true }),
  validate.locationLine2().optional({ checkFalsy: true }),
  validate.locationTown().optional({ checkFalsy: true }),
  validate.locationPostcode().optional({ checkFalsy: true }),
  validate.capacity().optional({ checkFalsy: true }),
  validate.isCancelled().optional({ checkFalsy: false }),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const msg = errors.errors
        .map((err) => `'${err.param}': ${err.msg}`)
        .join(' ');
      return next(
        createError(400, 'Field validation failed. ' + msg, {
          fieldValidationErrors: errors.errors,
        })
      );
    }

    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
      return next(createError(400, 'Invalid event id.'));
    }

    let event;
    try {
      event = await Event.findById(req.params.id);
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
// @route   DELETE /api/events/:id
// @access  Private, admin only
const deleteEvent = async (req, res, next) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return next(createError(400, 'Invalid event id.'));
  }

  let event;
  try {
    event = await Event.findByIdAndDelete(req.params.id);
    // remove related attendee records.
    await Attendee.deleteMany({ event: req.params.id });
    return res.status(200).json(event);
  } catch (err) {
    return next(err);
  }
};

// @desc    Register the authenticated user for an event
// @route   POST /api/events/:id/attendees/me
// @access  Private
const createAuthUserAttendee = async (req, res, next) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return next(createError(400, 'Invalid event id.'));
  }

  let event;
  let attendee;
  try {
    event = await Event.findById(req.params.id);
    attendee = await Attendee.findOne({
      user: req.user.id,
      event: req.params.id,
    });
  } catch (err) {
    return next(err);
  }

  if (!event) {
    return next(createError(404, 'Event not found'));
  }

  if (attendee) {
    return next(
      createError(409, 'Cannot join event, you are already registered.')
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
    event: new ObjectId(req.params.id),
    user: new ObjectId(req.user.id),
    guests: 0,
  });

  try {
    attendee = await attendee.save();
  } catch (err) {
    return next(err);
  }

  try {
    const updatedEvent = await getPopulatedEvent(req.params.id, req.user.id);
    return res.status(200).json(updatedEvent);
  } catch (err) {
    return next(err);
  }
};

// @desc    De-register the authenticated user from an event
// @route   DELETE /api/events/:id/attendees/me
// @access  Private
const deleteAuthUserAttendee = async (req, res, next) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return next(createError(400, 'Invalid event id.'));
  }

  let event;
  let attendee;
  try {
    event = await Event.findById(req.params.id);
    attendee = await Attendee.findOne({
      user: req.user.id,
      event: req.params.id,
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
    const updatedEvent = await getPopulatedEvent(req.params.id, req.user.id);
    return res.status(200).json(updatedEvent);
  } catch (err) {
    return next(err);
  }
};

// @desc    Update the authenticated user's attendance to the given event.
// @route   PUT /api/events/:id/attendees/me
// @access  Private
const updateAuthUserAttendee = [
  validate.guests().optional({ checkFalsy: true }),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(
        createError(400, 'Field validation failed.', {
          fieldValidationErrors: errors.errors,
        })
      );
    }

    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
      return next(createError(400, 'Invalid event id.'));
    }

    let event;
    let attendee;
    try {
      event = await Event.findById(req.params.id);
      attendee = await Attendee.findOne({
        user: req.user.id,
        event: req.params.id,
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
      const updatedEvent = await getPopulatedEvent(req.params.id, req.user.id);
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
  validate.guests().optional({ checkFalsy: true }),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(
        createError(400, 'Field validation failed.', {
          fieldValidationErrors: errors.errors,
        })
      );
    }

    if (!mongoose.isObjectIdOrHexString(req.params.eventId)) {
      return next(createError(400, 'Invalid event id.'));
    }

    if (!mongoose.isObjectIdOrHexString(req.params.userId)) {
      return next(createError(400, 'Invalid user id.'));
    }

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
      const updatedEvent = await getPopulatedEvent(req.params.eventId, req.user.id);
      return res.status(200).json(updatedEvent);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Remove the given attendee record
// @route   DELETE /api/events/:eventId/attendees/:userId
// @access  Private, admin only
const deleteAttendee = async (req, res, next) => {
  if (!mongoose.isObjectIdOrHexString(req.params.eventId)) {
    return next(createError(400, 'Invalid event id.'));
  }

  if (!mongoose.isObjectIdOrHexString(req.params.userId)) {
    return next(createError(400, 'Invalid user id.'));
  }

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
};

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
  // createAttendee,
  updateAttendee,
  deleteAttendee,
};
