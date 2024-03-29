import { rest } from 'msw';

import { db } from '../db';
import { requireAuth } from '../utils';
import { API_URL } from '../../../config';

export const eventsHandlers = [
  rest.get(`${API_URL}/events`, (req, res, ctx) => {
    try {
      requireAuth(req);
      const events = db.event.getAll();
      return res(ctx.json(events));
    } catch (err) {
      return res(
        ctx.status(400),
        ctx.json({ message: err?.message || 'Server error' })
      );
    }
  }),

  rest.post(`${API_URL}/events`, (req, res, ctx) => {
    try {
      requireAuth(req);

      const eventData = req.body;
      if (
        !eventData.category ||
        !eventData.buildUpTime ||
        !eventData.startTime ||
        !eventData.endTime ||
        !eventData.locationLine1 ||
        !eventData.locationTown ||
        !eventData.locationPostcode
      ) {
        throw new Error('Missing user input data.');
      }

      const event = db.event.create({
        ...eventData,
      });

      return res(ctx.json(event));
    } catch (err) {
      return res(
        ctx.status(400),
        ctx.json({ message: err?.message || 'Server error' })
      );
    }
  }),

  rest.get(`${API_URL}/events/:eventId`, (req, res, ctx) => {
    try {
      requireAuth(req);
      const event = db.event.findFirst({
        where: { id: { equals: req.params.eventId } },
      });
      if (!event) {
        return res(ctx.status(404), ctx.json({ message: 'Event not found' }));
      }
      return res(ctx.json(event));
    } catch (err) {
      return res(
        ctx.status(400),
        ctx.json({ message: err?.message || 'Server error' })
      );
    }
  }),

  rest.patch(`${API_URL}/events/:eventId`, (req, res, ctx) => {
    try {
      requireAuth(req);

      const result = db.event.update({
        where: {
          id: {
            equals: req.params.eventId,
          },
        },
        data: req.body,
      });

      return res(ctx.json(result));
    } catch (err) {
      return res(
        ctx.status(400),
        ctx.json({ message: err?.message || 'Server error' })
      );
    }
  }),

  // TODO
  rest.delete(`${API_URL}/events/:eventId`, (req, res, ctx) => {}),

  // TODO
  rest.post(`${API_URL}/events/:eventId/attendees/me`, (req, res, ctx) => {}),

  // TODO
  rest.patch(`${API_URL}/events/:eventId/attendees/me`, (req, res, ctx) => {}),

  // TODO
  rest.delete(`${API_URL}/events/:eventId/attendees/me`, (req, res, ctx) => {}),

  rest.post(`${API_URL}/events/:eventId/attendees/:userId`, (req, res, ctx) => {
    try {
      requireAuth(req, { admin: true });

      const event = db.event.findFirst({
        where: { id: { equals: req.params.eventId } },
      });
      const user = db.user.findFirst({
        where: { id: { equals: req.params.userId } },
      });

      const exists = event.attendees.find((x) => x.user.id === user.id);
      if (exists) {
        throw new Error('Attendee already exists');
      }

      const attendee = db.attendee.create({
        user,
        guests: 0,
      });

      const updatedEvent = db.event.update({
        where: { id: { equals: event.id } },
        data: {
          numAttendees: (prev) => prev + 1,
          attendees: (prev) => prev.concat(attendee),
        },
      });

      return res(ctx.json(updatedEvent));
    } catch (err) {
      return res(
        ctx.status(400),
        ctx.json({ message: err?.message || 'Server error' })
      );
    }
  }),

  // TODO
  rest.patch(
    `${API_URL}/events/:eventId/attendees/:userId`,
    (req, res, ctx) => {}
  ),

  // TODO
  rest.delete(
    `${API_URL}/events/:eventId/attendees/:userId`,
    (req, res, ctx) => {}
  ),
];
