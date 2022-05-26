import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import createError from 'http-errors';

import { Attendee, Event } from '../models';
import validate from '../middleware/validation/eventValidation';

const { ObjectId } = mongoose.Types;

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const readEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    return res.status(200).json(events);
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
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(
        createError(400, 'Field validation failed.', {
          fieldValidationErrors: errors.errors,
        })
      );
    }

    try {
      const event = await Event.create({
        time: {
          buildUp: req.body.buildUpTime,
          start: req.body.startTime,
          end: req.body.endTime,
        }
      });
      return res.status(200).json(event);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Retrieve the next event of type 'match' in chronological order
// @route   GET /api/events/next-match
// @access  Private
const readNextMatch = async (req, res, next) => {
  try {
    // TODO find the appropriate event.
    const nextMatch = await Event.findOne();

    return res.status(200).json(nextMatch);
  } catch (err) {
    return next(err);
  }
};

// @desc    Get all attendees for the given event id
// @route   GET /api/events/:id/attendees
// @access  Private
const readAttendees = async (req, res, next) => {
  try {
    const attendees = await Attendee.find({ event: req.params.id }).populate(
      'user',
      ['firstName', 'lastName']
    );
    return res.status(200).json(attendees);
  } catch (err) {
    return next(err);
  }
};

// @desc    Get the authenticated user attendee record for the given event id
// @route   GET /api/events/:id/attendees/me
// @access  Private
const readAuthUserAttendee = async (req, res, next) => {
  try {
    const attendee = await Attendee.findOne({
      event: req.params.id,
      user: req.user.id,
    });
    return res.status(200).json(attendee);
  } catch (err) {
    return next(err);
  }
};

// @desc    Register the authenticated user for an event
// @route   POST /api/events/:id/attendees/me
// @access  Private
const createAuthUserAttendee = async (req, res, next) => {
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

  // TODO
  //  if (event.locked) {
  //    return next(
  //      createError(400, 'It is no longer possible to join this event.')
  //    );
  //  }

  attendee = new Attendee({
    event: new ObjectId(req.params.id),
    user: new ObjectId(req.user.id),
    guests: 0,
  });

  try {
    attendee = await attendee.save();
    await attendee.populate('user', ['firstName', 'lastName']);
  } catch (err) {
    return next(err);
  }

  return res.status(200).json(attendee);
};

// @desc    De-register the authenticated user from an event
// @route   DELETE /api/events/:id/attendees/me
// @access  Private
const deleteAuthUserAttendee = async (req, res, next) => {
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

  // TODO
  //  if (event.locked) {
  //    return next(
  //      createError(400, 'Your event attendance can no longer be changed.')
  //    );
  //  }

  // Remove attendee document from collection.
  try {
    attendee = await Attendee.findByIdAndDelete(attendee.id);
  } catch (err) {
    return next(err);
  }

  return res.status(200).json(attendee);
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

    if (req.body.guests >= 0) {
      attendee.guests = req.body.guests;
    }

    // TODO
    //  if (event.locked) {
    //    return next(
    //      createError(400, 'Your event attendance can no longer be changed.')
    //    );
    //  }

    try {
      attendee = await attendee.save();
      await attendee.populate('user', ['firstName', 'lastName']);
    } catch (err) {
      return next(err);
    }

    return res.status(200).json(attendee);
  },
];

// TODO currently unused
//
// const convertUsersToArray = (req, res, next) => {
//   if (!(req.body.users instanceof Array)) {
//     if (req.body.users) {
//       req.body.users = new Array(req.body.users);
//     } else {
//       req.body.users = [];
//     }
//   }
//   next();
// };
//
// const validateAndSanitiseInput = [
//   body('start', 'Invalid start.').isISO8601().toDate(),
//   body('users.*').escape(),
// ];
//
// TODO currently unused
//
// // @desc    Create event
// // @route   POST /api/events
// // @access  Private
// const createEvent = [
//   convertUsersToArray,
//   validateAndSanitiseInput,
//   async (req, res, next) => {
//     const errors = validationResult(req);
//
//     if (!errors.isEmpty()) {
//       return next(
//         createError(400, 'Field validation failed.', {
//           fieldValidationErrors: errors.errors,
//         })
//       );
//     }
//
//     try {
//       const event = await Event.create({
//         start: req.body.start,
//       });
//       return res.status(200).json(event);
//     } catch (err) {
//       return next(err);
//     }
//   },
// ];
//
// // @desc    Get an event
// // @route   GET /api/events/:id
// // @access  Private
// const readEvent = async (req, res, next) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     return res.status(200).json(event);
//   } catch (err) {
//     return next(err);
//   }
// };
//
// // @desc    Edit event
// // @route   PUT /api/events/:id
// // @access  Private
// const updateEvent = (req, res, next) => {
//   // TODO
//   res.status(200).json({ message: `Update event; id=${req.params.id}` });
// };
//
// // @desc    Delete an event
// // @route   DELETE /api/events/:id
// // @access  Private
// const deleteEvent = (req, res, next) => {
//   // TODO
//   res.status(200).json({ message: `Delete event; id=${req.params.id}` });
// };

export default {
  readEvents,
  createEvent,
  readNextMatch,
  readAttendees,
  createAuthUserAttendee,
  readAuthUserAttendee,
  updateAuthUserAttendee,
  deleteAuthUserAttendee,
  //  readEvent,
  //  updateEvent,
  //  deleteEvent,
};
