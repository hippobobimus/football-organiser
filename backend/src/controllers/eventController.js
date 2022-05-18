// import { body, validationResult } from 'express-validator';
// import createError from 'http-errors';
import { Event } from '../models';

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

// @desc    Retrieve the next event of type 'match' in chronological order
// @route   GET /api/events/next-match
// @access  Private
const getNextMatch = async (req, res, next) => {
  try {
    const nextMatch = await Event.findOne();
    return res.status(200).json(nextMatch);
  } catch (err) {
    return next(err);
  }
};

// TODO currently unused
//
// // @desc    Register the current user for an event
// // @route   GET /api/events/:id/join
// // @access  Private
// const joinEvent = async (req, res, next) => {
//   // TODO
//   res.status(200).json({ message: `Join event ${req.params.id}` });
// };
//
// // @desc    De-register the current user for an event
// // @route   GET /api/events/:id/join
// // @access  Private
// const leaveEvent = async (req, res, next) => {
//   // TODO
//   res.status(200).json({ message: `Leave event ${req.params.id}` });
// };
//
// // @desc    Get events
// // @route   GET /api/events
// // @access  Private
// const readEvents = async (req, res, next) => {
//   try {
//     const events = await Event.find();
//     return res.status(200).json(events);
//   } catch (err) {
//     return next(err);
//   }
// };
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
  getNextMatch,
  //  joinEvent,
  //  leaveEvent,
  //  readEvents,
  //  createEvent,
  //  readEvent,
  //  updateEvent,
  //  deleteEvent,
};
