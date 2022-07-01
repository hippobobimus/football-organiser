import createError from 'http-errors';
import mongoose from 'mongoose';

import { Attendee, Event, User } from '../models';

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

/*
 * Exported functions
 */

export const getEvents = async (authUserId, query) => {
  // defaults to page 1 of results.
  const page = query?.page > 0 ? query.page : 1;

  // defaults to unfinished events.
  const finished = query?.finished === 'true';

  let options = {
    page,
    limit: 4,
  };

  let filter;

  if (finished) {
    // past events.
    filter = { 'time.end': { $lt: Date.now() } };

    // show most recent first.
    options.sort = { 'time.start': 'desc' };
  } else {
    // upcoming and in-progress events.
    filter = { 'time.end': { $gte: Date.now() } };

    // show most recent first.
    options.sort = { 'time.start': 'asc' };
  }

  let results = await Event.paginate(filter, options);

  results.docs.forEach((event) => populateEvent(event, authUserId));

  return results;
};

export const createEvent = async (authUserId, eventData) => {
  if (
    !eventData.category ||
    !eventData.buildUpTime ||
    !eventData.startTime ||
    !eventData.endTime ||
    !eventData.locationLine1 ||
    !eventData.locationTown ||
    !eventData.locationPostcode
  ) {
    throw createError(400, 'Missing user input data.');
  }

  const event = await Event.create({
    category: eventData.category,
    name: eventData.name || 'Event',
    time: {
      buildUp: eventData.buildUpTime,
      start: eventData.startTime,
      end: eventData.endTime,
    },
    location: {
      name: eventData.locationName || '',
      line1: eventData.locationLine1,
      line2: eventData.locationLine2 || '',
      town: eventData.locationTown,
      postcode: eventData.locationPostcode,
    },
    capacity: eventData.capacity || -1,
  });

  populateEvent(event, authUserId);

  return event;
};

export const getEvent = async (authUserId, eventId) => {
  if (!mongoose.isObjectIdOrHexString(eventId)) {
    throw createError(401, 'Invalid event id.');
  }

  let event = await Event.findById(eventId);

  if (!event) {
    throw createError(401, 'Event does not exist.');
  }

  event = populateEvent(event, authUserId);

  return event;
};

export const getNextMatch = async (authUserId) => {
  const query = await Event.find({
    category: 'match',
    'time.end': { $gte: new Date() },
  })
    .sort({
      'time.end': 'asc',
    })
    .limit(1);

  if (query.length === 0) {
    // no upcoming matches
    return null;
  }

  const nextMatch = await populateEvent(query[0], authUserId);

  return nextMatch;
};

export const updateEvent = async (authUserId, eventId, update) => {
  if (!authUserId || !eventId || !update) {
    throw createError(400, 'Missing function argument(s).');
  }

  let event = await Event.findById(eventId);

  if (!event) {
    throw createError(404, 'Event not found');
  }

  // whitelist request body.
  if (update.buildUpTime) {
    event.time.buildUp = update.buildUpTime;
  }
  if (update.startTime) {
    event.time.start = update.startTime;
  }
  if (update.endTime) {
    event.time.end = update.endTime;
  }
  if (update.category) {
    event.category = update.category;
  }
  if (update.name) {
    event.name = update.name;
  }
  if (update.locationName) {
    event.location.name = update.locationName;
  }
  if (update.locationLine1) {
    event.location.line1 = update.locationLine1;
  }
  if (update.locationLine2) {
    event.location.line2 = update.locationLine2;
  }
  if (update.locationTown) {
    event.location.town = update.locationTown;
  }
  if (update.locationPostcode) {
    event.location.postcode = update.locationPostcode;
  }
  if (update.capacity) {
    event.capacity = update.capacity;
  }
  if (typeof update.isCancelled !== 'undefined') {
    event.isCancelled = update.isCancelled;
  }

  event = await event.save();

  event = await populateEvent(event, authUserId);

  return event;
};

export const deleteEvent = async (authUserId, eventId) => {
  let event = await Event.findByIdAndDelete(eventId);
  event = await populateEvent(event, authUserId);

  // remove related attendee records.
  await Attendee.deleteMany({ event: eventId });

  return event;
};
