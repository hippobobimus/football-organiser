import request from 'supertest';
import { isAfter, isBefore, isEqual, parseISO, add, sub } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz/esm';
import mongoose from 'mongoose';

import app from '../app';
import * as db from '../config/testDb';
import { Attendee, AppEvent } from '../models';
import {
  createAttendee,
  createAuthUser,
  createEvent,
  createEvents,
  createUser,
  fillEvent,
} from '../test/utils';
import { eventGenerator } from '../test/dataGenerators';
import { TIMEZONE } from '../config';

describe('events', () => {
  let auth;
  let authAdmin;
  let futureMatches;
  let pastMatches;
  let futureSocials;
  let pastSocials;
  let cancelledEvents;

  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.close();
  });

  beforeEach(async () => {
    auth = await createAuthUser();
    authAdmin = await createAuthUser({ role: 'admin' });
    futureMatches = await createEvents(5);
    pastMatches = await createEvents(5, { past: true });
    futureSocials = await createEvents(5, {
      overrides: { category: 'social' },
    });
    pastSocials = await createEvents(5, {
      overrides: { category: 'social' },
      past: true,
    });
    cancelledEvents = await createEvents(5, {
      overrides: { isCancelled: true },
    });
  });

  afterEach(async () => {
    await db.clear();
  });

  describe('GET /api/events', () => {
    const path = '/api/events';

    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).get(path);
      expect(statusCode).toBe(401);
    });

    it('should return 200 with authorization', async () => {
      const { statusCode } = await request(app)
        .get(path)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);
    });

    it('should return json', async () => {
      const { statusCode, headers } = await request(app)
        .get(path)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return events paginated in pages of 4', async () => {
      const { statusCode, body } = await request(app)
        .get(path)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);

      // expected events on page
      expect(body.limit).toBe(4);
      expect(body.docs.length).toBe(4);
    });

    it('should default to returning page 1 of upcoming or in-progress events', async () => {
      const { statusCode, body } = await request(app)
        .get(path)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);

      // expected events on page
      expect(body.totalDocs).toBe(
        futureMatches.length + futureSocials.length + cancelledEvents.length
      );
      expect(body.page).toBe(1);

      body.docs.forEach((event) => {
        expect(event.isFinished).toBeFalsy();
      });
    });

    it('query: "?page=n" --> should return page n of events', async () => {
      const { statusCode, body } = await request(app)
        .get(path + '?page=2')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);

      // expected events on page
      expect(body.page).toBe(2);
    });

    it('query: "?finished=true" --> should return only finished events', async () => {
      const { statusCode, body } = await request(app)
        .get(path + '?finished=true')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);

      body.docs.forEach((event) => {
        expect(event.isFinished).toBeTruthy();
      });
    });

    it('query: "?finished=false" --> should return only unfinished events', async () => {
      const { statusCode, body } = await request(app)
        .get(path + '?finished=false')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);

      body.docs.forEach((event) => {
        expect(event.isFinished).toBeFalsy();
      });
    });

    it('should return finished events in descending order of start time', async () => {
      const { statusCode, body } = await request(app)
        .get(path + '?finished=true')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);

      for (
        let i = 0, j = 1;
        i < body.docs.length - 1 && j < body.docs.length;
        i += 1, j += 1
      ) {
        let curr = parseISO(body.docs[i].time.start);
        let next = parseISO(body.docs[j].time.start);
        expect(isAfter(curr, next) || isEqual(curr, next)).toBeTruthy();
      }
    });

    it('should return unfinished events in ascending order of start time', async () => {
      const { statusCode, body } = await request(app)
        .get(path + '?finished=false')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);

      for (
        let i = 0, j = 1;
        i < body.docs.length - 1 && j < body.docs.length;
        i += 1, j += 1
      ) {
        let curr = parseISO(body.docs[i].time.start);
        let next = parseISO(body.docs[j].time.start);
        expect(isBefore(curr, next) || isEqual(curr, next)).toBeTruthy();
      }
    });

    it('should return correct event fields', async () => {
      const { statusCode, body } = await request(app)
        .get(path)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);

      const events = futureMatches
        .concat(pastMatches)
        .concat(futureSocials)
        .concat(pastSocials)
        .concat(cancelledEvents);

      body.docs.forEach((returnedEvent) => {
        const expectedEvent = events.find(
          (curr) => curr.id === returnedEvent.id
        );
        expect(returnedEvent).toEqual({
          __v: 0,
          _id: expect.any(String),
          capacity: expectedEvent.capacity,
          category: expectedEvent.category,
          createdAt: expect.any(String),
          id: expect.any(String),
          isCancelled: expectedEvent.isCancelled,
          isFinished: expectedEvent.isFinished,
          isFull: expectedEvent.isFull,
          location: expectedEvent.location,
          name: expectedEvent.name,
          numAttendees: expectedEvent.numAttendees,
          time: {
            buildUp: expectedEvent.time.buildUp.toISOString(),
            start: expectedEvent.time.start.toISOString(),
            end: expectedEvent.time.end.toISOString(),
          },
          updatedAt: expect.any(String),
        });
      });
    });
  });

  describe('POST /api/events', () => {
    const path = '/api/events';

    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).post(path);

      expect(statusCode).toBe(401);
    });

    it('should return 403 if the auth user is not an admin', async () => {
      const { statusCode } = await request(app)
        .post(path)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(403);
    });

    it('should return 200 if the auth user is an admin', async () => {
      const input = eventGenerator();
      const { statusCode } = await request(app)
        .post(path)
        .set('Authorization', `bearer ${authAdmin.accessToken}`)
        .send(input);

      expect(statusCode).toBe(200);
    });

    it('should return 400 if provided time is not in the future', async () => {
      const input = eventGenerator({
        overrides: {
          buildUpTime: sub(new Date(), { seconds: 1 }),
        },
      });
      const { statusCode } = await request(app)
        .post(path)
        .set('Authorization', `bearer ${authAdmin.accessToken}`)
        .send(input);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if provided times are not in sequence', async () => {
      const now = new Date();

      const startBeforeBuildUp = eventGenerator({
        overrides: {
          buildUpTime: add(now, { days: 1, seconds: 1 }),
          startTime: add(now, { days: 1 }),
          endTime: add(now, { days: 1, seconds: 2 }),
        },
      });

      const endBeforeStart = eventGenerator({
        overrides: {
          buildUpTime: add(now, { days: 1 }),
          startTime: add(now, { days: 1, seconds: 2 }),
          endTime: add(now, { days: 1, seconds: 1 }),
        },
      });

      const { statusCode: statusCode1 } = await request(app)
        .post(path)
        .set('Authorization', `bearer ${authAdmin.accessToken}`)
        .send(startBeforeBuildUp);
      expect(statusCode1).toBe(400);

      const { statusCode: statusCode2 } = await request(app)
        .post(path)
        .set('Authorization', `bearer ${authAdmin.accessToken}`)
        .send(endBeforeStart);
      expect(statusCode2).toBe(400);
    });

    it('should return 400 if a required field is missing', async () => {
      const noBuildUpTime = eventGenerator({ overrides: { buildUpTime: '' } });
      const noStartTime = eventGenerator({ overrides: { startTime: '' } });
      const noEndTime = eventGenerator({ overrides: { endTime: '' } });
      const noCategory = eventGenerator({ overrides: { category: '' } });
      const noLocationLine1 = eventGenerator({
        overrides: { locationLine1: '' },
      });
      const noLocationTown = eventGenerator({
        overrides: { locationTown: '' },
      });
      const noLocationPostcode = eventGenerator({
        overrides: { locationPostcode: '' },
      });

      await Promise.all(
        [
          noBuildUpTime,
          noStartTime,
          noEndTime,
          noCategory,
          noLocationLine1,
          noLocationTown,
          noLocationPostcode,
        ].map(async (input) => {
          const { statusCode } = await request(app)
            .post(path)
            .set('Authorization', `bearer ${authAdmin.accessToken}`)
            .send(input);
          expect(statusCode).toBe(400);
        })
      );
    });

    it('should return json', async () => {
      const input = eventGenerator();
      const { statusCode, headers } = await request(app)
        .post(path)
        .set('Authorization', `bearer ${authAdmin.accessToken}`)
        .send(input);

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return created event with correct fields', async () => {
      const input = eventGenerator();

      const { statusCode, body } = await request(app)
        .post(path)
        .set('Authorization', `bearer ${authAdmin.accessToken}`)
        .send(input);

      expect(statusCode).toBe(200);

      expect(body).toEqual({
        __v: 0,
        _id: expect.any(String),
        capacity: Number(input.capacity),
        category: input.category,
        createdAt: expect.any(String),
        id: expect.any(String),
        isCancelled: false,
        isFinished: false,
        isFull: false,
        location: {
          name: input.locationName,
          line1: input.locationLine1,
          line2: input.locationLine2,
          town: input.locationTown,
          postcode: input.locationPostcode,
        },
        name: input.name,
        numAttendees: 0,
        time: {
          buildUp: zonedTimeToUtc(input.buildUpTime, TIMEZONE).toISOString(),
          start: zonedTimeToUtc(input.startTime, TIMEZONE).toISOString(),
          end: zonedTimeToUtc(input.endTime, TIMEZONE).toISOString(),
        },
        updatedAt: expect.any(String),
      });
    });
  });

  describe('GET /api/events/:id', () => {
    const path = '/api/events/';

    it('should return 401 without authorization', async () => {
      const event = futureMatches[0];
      const { statusCode } = await request(app).get(path + event.id);

      expect(statusCode).toBe(401);
    });

    it('should return 200 with authorization', async () => {
      const event = futureMatches[0];
      const { statusCode } = await request(app)
        .get(path + event.id)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);
    });

    it('should return 400 with an invalid event id', async () => {
      const { statusCode } = await request(app)
        .get(path + 'notanid')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if the event is not found', async () => {
      const { statusCode } = await request(app)
        .get(path + new mongoose.Types.ObjectId().toString())
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(401);
    });

    it('should return json', async () => {
      const event = futureMatches[0];
      const { statusCode, headers } = await request(app)
        .get(path + event.id)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return event with correct fields', async () => {
      const event = futureMatches[0];
      const { statusCode, body } = await request(app)
        .get(path + event.id)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);

      expect(body).toEqual({
        __v: 0,
        _id: event.id,
        attendees: [],
        authUserAttendee: null,
        capacity: event.capacity,
        category: event.category,
        createdAt: expect.any(String),
        id: event.id,
        isCancelled: false,
        isFinished: false,
        isFull: false,
        location: {
          name: event.location.name,
          line1: event.location.line1,
          line2: event.location.line2,
          town: event.location.town,
          postcode: event.location.postcode,
        },
        name: event.name,
        numAttendees: 0,
        time: {
          buildUp: event.time.buildUp.toISOString(),
          start: event.time.start.toISOString(),
          end: event.time.end.toISOString(),
        },
        updatedAt: expect.any(String),
      });
    });
  });

  describe('GET /api/events/next-match', () => {
    const path = '/api/events/next-match';

    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).get(path);

      expect(statusCode).toBe(401);
    });

    it('should return 200 with authorization', async () => {
      const { statusCode } = await request(app)
        .get(path)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);
    });

    it('should return null if no upcoming match is found', async () => {
      // remove all upcoming matches
      await AppEvent.deleteMany({
        category: 'match',
        'time.end': { $gte: sub(new Date(), { hours: 1 }) },
      });

      const { statusCode, body } = await request(app)
        .get(path)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);
      expect(body).toBe(null);
    });

    it('should return json', async () => {
      const { statusCode, headers } = await request(app)
        .get(path)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return correct event with correct fields', async () => {
      const { statusCode, body } = await request(app)
        .get(path)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);

      const event = futureMatches.sort(
        (prev, curr) => prev.time.end - curr.time.end
      )[0];
      expect(body).toEqual({
        __v: 0,
        _id: event.id,
        attendees: [],
        authUserAttendee: null,
        capacity: event.capacity,
        category: event.category,
        createdAt: expect.any(String),
        id: event.id,
        isCancelled: false,
        isFinished: false,
        isFull: false,
        location: {
          name: event.location.name,
          line1: event.location.line1,
          line2: event.location.line2,
          town: event.location.town,
          postcode: event.location.postcode,
        },
        name: event.name,
        numAttendees: 0,
        time: {
          buildUp: event.time.buildUp.toISOString(),
          start: event.time.start.toISOString(),
          end: event.time.end.toISOString(),
        },
        updatedAt: expect.any(String),
      });
    });
  });

  describe('PATCH /api/events/:eventId', () => {
    const path = '/api/events/';

    it('should return 401 without authentication', async () => {
      const event = futureMatches[0];
      const { statusCode } = await request(app).patch(path + event.id);

      expect(statusCode).toBe(401);
    });

    it('should return 403 without admin rights', async () => {
      const event = futureMatches[0];
      const { statusCode } = await request(app)
        .patch(path + event.id)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(403);
    });

    it('should return 200 with authentication and admin rights', async () => {
      const event = futureMatches[0];
      const { statusCode } = await request(app)
        .patch(path + event.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`)
        .send({});

      expect(statusCode).toBe(200);
    });

    it('should return json', async () => {
      const event = futureMatches[0];
      const { statusCode, headers } = await request(app)
        .patch(path + event.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`)
        .send({});

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return updated event with correct fields', async () => {
      const event = futureMatches[0];
      const update = eventGenerator();

      const { statusCode, body } = await request(app)
        .patch(path + event.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`)
        .send(update);

      expect(statusCode).toBe(200);

      expect(body).toEqual({
        __v: 0,
        _id: event.id,
        attendees: [],
        authUserAttendee: null,
        capacity: Number(update.capacity),
        category: update.category,
        createdAt: expect.any(String),
        id: event.id,
        isCancelled: false,
        isFinished: false,
        isFull: false,
        location: {
          name: update.locationName,
          line1: update.locationLine1,
          line2: update.locationLine2,
          town: update.locationTown,
          postcode: update.locationPostcode,
        },
        name: update.name,
        numAttendees: 0,
        time: {
          buildUp: zonedTimeToUtc(update.buildUpTime, TIMEZONE).toISOString(),
          start: zonedTimeToUtc(update.startTime, TIMEZONE).toISOString(),
          end: zonedTimeToUtc(update.endTime, TIMEZONE).toISOString(),
        },
        updatedAt: expect.any(String),
      });
    });
  });

  describe('DELETE /api/events/:eventId', () => {
    const path = '/api/events/';

    it('should return 401 without authentication', async () => {
      const event = futureMatches[0];
      const { statusCode } = await request(app).delete(path + event.id);

      expect(statusCode).toBe(401);
    });

    it('should return 403 without admin rights', async () => {
      const event = futureMatches[0];
      const { statusCode } = await request(app)
        .delete(path + event.id)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(403);
    });

    it('should return 200 with authentication and admin rights', async () => {
      const event = futureMatches[0];
      const { statusCode } = await request(app)
        .delete(path + event.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(200);
    });

    it('should remove event from database', async () => {
      const event = futureMatches[0];
      const { statusCode } = await request(app)
        .delete(path + event.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(200);

      const found = await AppEvent.findById(event.id);

      expect(found).toBeFalsy();
    });

    it('should return json', async () => {
      const event = futureMatches[0];
      const { statusCode, headers } = await request(app)
        .delete(path + event.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return deleted event with correct fields', async () => {
      const event = futureMatches[0];
      const { statusCode, body } = await request(app)
        .delete(path + event.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(200);

      expect(body).toEqual({
        __v: 0,
        _id: event.id,
        attendees: [],
        authUserAttendee: null,
        capacity: event.capacity,
        category: event.category,
        createdAt: expect.any(String),
        id: event.id,
        isCancelled: false,
        isFinished: false,
        isFull: false,
        location: {
          name: event.location.name,
          line1: event.location.line1,
          line2: event.location.line2,
          town: event.location.town,
          postcode: event.location.postcode,
        },
        name: event.name,
        numAttendees: 0,
        time: {
          buildUp: event.time.buildUp.toISOString(),
          start: event.time.start.toISOString(),
          end: event.time.end.toISOString(),
        },
        updatedAt: expect.any(String),
      });
    });
  });

  describe('POST /api/events/:eventId/attendees/me', () => {
    const path = '/api/events/';

    it('should return 401 without authorization', async () => {
      const event = futureMatches[0];
      const { statusCode } = await request(app).post(
        path + event.id + '/attendees/me'
      );

      expect(statusCode).toBe(401);
    });

    it('should return 200 with authorization', async () => {
      const event = futureMatches[0];
      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);
    });

    it('should return 404 if event does not exist', async () => {
      const notAnEventId = new mongoose.Types.ObjectId();

      const { statusCode } = await request(app)
        .post(path + notAnEventId + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(404);
    });

    it('should return 400 if auth user already registered for event', async () => {
      const event = futureMatches[0];
      await new Attendee({
        event: event.id,
        user: auth.user.id,
      }).save();

      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if event has finished', async () => {
      const finishedEvent = pastMatches[0];

      const { statusCode } = await request(app)
        .post(path + finishedEvent.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if event has been cancelled', async () => {
      const event = cancelledEvents[0];

      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if event is full', async () => {
      const event = fillEvent(futureMatches[0]);

      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(400);
    });

    it('should add auth user to event', async () => {
      const event = futureMatches[0];
      const attendeeBefore = await Attendee.find({
        user: auth.user.id,
        event: event.id,
      });
      expect(attendeeBefore.length).toBe(0);

      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);

      const attendeeAfter = await Attendee.find({
        user: auth.user.id,
        event: event.id,
      });
      expect(attendeeAfter.length).toBe(1);
    });

    it('should return updated event', async () => {
      const event = futureMatches[0];
      const { statusCode, body } = await request(app)
        .post(path + event.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);

      expect(body).toEqual({
        __v: 0,
        _id: event.id,
        attendees: [
          {
            __v: 0,
            _id: expect.any(String),
            createdAt: expect.any(String),
            event: event.id,
            guests: 0,
            id: expect.any(String),
            updatedAt: expect.any(String),
            user: {
              _id: auth.user.id,
              firstName: auth.user.firstName,
              id: auth.user.id,
              isAdmin: auth.user.isAdmin,
              lastName: auth.user.lastName,
              name: auth.user.name,
            },
          },
        ],
        authUserAttendee: {
          __v: 0,
          _id: expect.any(String),
          createdAt: expect.any(String),
          event: event.id,
          guests: 0,
          id: expect.any(String),
          updatedAt: expect.any(String),
          user: {
            _id: auth.user.id,
            firstName: auth.user.firstName,
            id: auth.user.id,
            isAdmin: auth.user.isAdmin,
            lastName: auth.user.lastName,
            name: auth.user.name,
          },
        },
        capacity: event.capacity,
        category: event.category,
        createdAt: expect.any(String),
        id: event.id,
        isCancelled: false,
        isFinished: false,
        isFull: false,
        location: {
          name: event.location.name,
          line1: event.location.line1,
          line2: event.location.line2,
          town: event.location.town,
          postcode: event.location.postcode,
        },
        name: event.name,
        numAttendees: 1,
        time: {
          buildUp: event.time.buildUp.toISOString(),
          start: event.time.start.toISOString(),
          end: event.time.end.toISOString(),
        },
        updatedAt: expect.any(String),
      });
    });
  });

  describe('PATCH /api/events/:eventId/attendees/me', () => {
    const path = '/api/events/';

    it('should return 401 without authorization', async () => {
      const event = futureMatches[0];
      const { statusCode } = await request(app).patch(
        path + event.id + '/attendees/me'
      );

      expect(statusCode).toBe(401);
    });

    it('should return 200 with authorization', async () => {
      const event = futureMatches[0];
      await createAttendee(event, auth.user);

      const { statusCode } = await request(app)
        .patch(path + event.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);
    });

    it('should return 404 if event does not exist', async () => {
      const notAnEventId = new mongoose.Types.ObjectId();

      const { statusCode } = await request(app)
        .patch(path + notAnEventId + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(404);
    });

    it('should return 400 if auth user not registered for event', async () => {
      const event = futureMatches[0];
      const { statusCode } = await request(app)
        .patch(path + event.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if event has finished', async () => {
      const event = pastMatches[0];
      await createAttendee(event, auth.user);

      const { statusCode } = await request(app)
        .patch(path + event.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if event has been cancelled', async () => {
      const event = cancelledEvents[0];
      await createAttendee(event, auth.user);

      const { statusCode } = await request(app)
        .patch(path + event.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if update exceeds event capacity', async () => {
      const event = fillEvent(futureMatches[0]);

      const { statusCode } = await request(app)
        .patch(path + event.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`)
        .send({ guests: 3 });

      expect(statusCode).toBe(400);
    });

    it('should return updated event', async () => {
      const event = await createEvent({ overrides: { capacity: 10 } });
      await createAttendee(event, auth.user);

      const { statusCode, body } = await request(app)
        .patch(path + event.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`)
        .send({ guests: 2 });

      expect(statusCode).toBe(200);

      expect(body).toEqual({
        __v: 0,
        _id: event.id,
        attendees: [
          {
            __v: 0,
            _id: expect.any(String),
            createdAt: expect.any(String),
            event: event.id,
            guests: 2,
            id: expect.any(String),
            updatedAt: expect.any(String),
            user: {
              _id: auth.user.id,
              firstName: auth.user.firstName,
              id: auth.user.id,
              isAdmin: auth.user.isAdmin,
              lastName: auth.user.lastName,
              name: auth.user.name,
            },
          },
        ],
        authUserAttendee: {
          __v: 0,
          _id: expect.any(String),
          createdAt: expect.any(String),
          event: event.id,
          guests: 2,
          id: expect.any(String),
          updatedAt: expect.any(String),
          user: {
            _id: auth.user.id,
            firstName: auth.user.firstName,
            id: auth.user.id,
            isAdmin: auth.user.isAdmin,
            lastName: auth.user.lastName,
            name: auth.user.name,
          },
        },
        capacity: event.capacity,
        category: event.category,
        createdAt: expect.any(String),
        id: event.id,
        isCancelled: false,
        isFinished: false,
        isFull: false,
        location: {
          name: event.location.name,
          line1: event.location.line1,
          line2: event.location.line2,
          town: event.location.town,
          postcode: event.location.postcode,
        },
        name: event.name,
        numAttendees: 3,
        time: {
          buildUp: event.time.buildUp.toISOString(),
          start: event.time.start.toISOString(),
          end: event.time.end.toISOString(),
        },
        updatedAt: expect.any(String),
      });
    });
  });

  describe('DELETE /api/events/:eventId/attendees/me', () => {
    const path = '/api/events/';

    it('should return 401 without authorization', async () => {
      const event = futureMatches[0];

      const { statusCode } = await request(app).delete(
        path + event.id + '/attendees/me'
      );

      expect(statusCode).toBe(401);
    });

    it('should return 200 with authorization', async () => {
      const event = futureMatches[0];
      await createAttendee(event, auth.user);

      const { statusCode } = await request(app)
        .delete(path + event.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);
    });

    it('should return 404 if event does not exist', async () => {
      const notAnEventId = new mongoose.Types.ObjectId();

      const { statusCode } = await request(app)
        .delete(path + notAnEventId + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(404);
    });

    it('should return 400 if auth user not registered for event', async () => {
      const event = futureMatches[0];

      const { statusCode } = await request(app)
        .delete(path + event.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if event has finished', async () => {
      const event = pastMatches[0];

      const { statusCode } = await request(app)
        .delete(path + event.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if event has been cancelled', async () => {
      const event = cancelledEvents[0];

      const { statusCode } = await request(app)
        .delete(path + event.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(400);
    });

    it('should remove auth user attendee record', async () => {
      const event = futureMatches[0];
      const attendee = await createAttendee(event, auth.user);

      const { statusCode } = await request(app)
        .delete(path + event.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);

      expect(await Attendee.findById(attendee.id)).toBeFalsy();
    });

    it('should return updated event', async () => {
      const event = futureMatches[0];
      await createAttendee(event, auth.user);

      const { statusCode, body } = await request(app)
        .delete(path + event.id + '/attendees/me')
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);

      expect(body).toEqual({
        __v: 0,
        _id: event.id,
        attendees: [],
        authUserAttendee: null,
        capacity: event.capacity,
        category: event.category,
        createdAt: expect.any(String),
        id: event.id,
        isCancelled: false,
        isFinished: false,
        isFull: false,
        location: {
          name: event.location.name,
          line1: event.location.line1,
          line2: event.location.line2,
          town: event.location.town,
          postcode: event.location.postcode,
        },
        name: event.name,
        numAttendees: 0,
        time: {
          buildUp: event.time.buildUp.toISOString(),
          start: event.time.start.toISOString(),
          end: event.time.end.toISOString(),
        },
        updatedAt: expect.any(String),
      });
    });
  });

  describe('POST /api/events/:eventId/attendees/:userId', () => {
    const path = '/api/events/';

    it('should return 401 without authorization', async () => {
      const event = futureMatches[0];
      const user = await createUser();

      const { statusCode } = await request(app).post(
        path + event.id + '/attendees/' + user.id
      );

      expect(statusCode).toBe(401);
    });

    it('should return 403 without admin rights', async () => {
      const event = futureMatches[0];
      const user = await createUser();

      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(403);
    });

    it('should return 200 with authorization and admin rights', async () => {
      const event = futureMatches[0];
      const user = await createUser();

      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(200);
    });

    it('should return 404 if event does not exist', async () => {
      const notAnEventId = new mongoose.Types.ObjectId();
      const user = await createUser();

      const { statusCode } = await request(app)
        .post(path + notAnEventId + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(404);
    });

    it('should return 400 if attendee already exists', async () => {
      const event = futureMatches[0];
      const user = await createUser();
      await createAttendee(event, user);

      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(400);
    });

    it('should return 200 even if event has finished', async () => {
      const event = pastMatches[0];
      const user = await createUser();

      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(200);
    });

    it('should return 200 even if event has been cancelled', async () => {
      const event = cancelledEvents[0];
      const user = await createUser();

      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(200);
    });

    it('should return 400 if event is full', async () => {
      const event = fillEvent(futureMatches[0]);
      const user = await createUser();

      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(400);
    });

    it('should create attendee for given event and user', async () => {
      const event = futureMatches[0];
      const user = await createUser();

      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(200);

      const attendeesFound = await Attendee.find({
        user: user.id,
        event: event.id,
      });

      expect(attendeesFound.length).toBe(1);
      expect(attendeesFound[0].user.toString()).toBe(user.id);
      expect(attendeesFound[0].event.toString()).toBe(event.id);
    });

    it('should return updated event', async () => {
      const event = futureMatches[0];
      const user = await createUser();

      const { statusCode, body } = await request(app)
        .post(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(200);

      expect(body).toEqual({
        __v: 0,
        _id: event.id,
        attendees: [
          {
            __v: 0,
            _id: expect.any(String),
            createdAt: expect.any(String),
            event: event.id,
            guests: 0,
            id: expect.any(String),
            updatedAt: expect.any(String),
            user: {
              _id: user.id,
              firstName: user.firstName,
              id: user.id,
              isAdmin: user.isAdmin,
              lastName: user.lastName,
              name: user.name,
            },
          },
        ],
        authUserAttendee: null,
        capacity: event.capacity,
        category: event.category,
        createdAt: expect.any(String),
        id: event.id,
        isCancelled: false,
        isFinished: false,
        isFull: false,
        location: {
          name: event.location.name,
          line1: event.location.line1,
          line2: event.location.line2,
          town: event.location.town,
          postcode: event.location.postcode,
        },
        name: event.name,
        numAttendees: 1,
        time: {
          buildUp: event.time.buildUp.toISOString(),
          start: event.time.start.toISOString(),
          end: event.time.end.toISOString(),
        },
        updatedAt: expect.any(String),
      });
    });
  });

  describe('PATCH /api/events/:eventId/attendees/:userId', () => {
    const path = '/api/events/';

    it('should return 401 without authorization', async () => {
      const event = futureMatches[0];
      const user = await createUser();
      await createAttendee(event, user);

      const { statusCode } = await request(app).patch(
        path + event.id + '/attendees/' + user.id
      );

      expect(statusCode).toBe(401);
    });

    it('should return 403 without admin rights', async () => {
      const event = futureMatches[0];
      const user = await createUser();
      await createAttendee(event, user);

      const { statusCode } = await request(app)
        .patch(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(403);
    });

    it('should return 200 with authorization and admin rights', async () => {
      const event = futureMatches[0];
      const user = await createUser();
      await createAttendee(event, user);

      const { statusCode } = await request(app)
        .patch(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(200);
    });

    it('should return 404 if event does not exist', async () => {
      const notAnEventId = new mongoose.Types.ObjectId();
      const user = await createUser();

      const { statusCode } = await request(app)
        .patch(path + notAnEventId + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(404);
    });

    it('should return 400 if attendee record not found', async () => {
      const event = futureMatches[0];
      const user = await createUser();

      const { statusCode } = await request(app)
        .patch(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(400);
    });

    it('should return 200 even if event has finished', async () => {
      const event = pastMatches[0];
      const user = await createUser();
      await createAttendee(event, user);

      const { statusCode } = await request(app)
        .patch(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(200);
    });

    it('should return 200 even if event has been cancelled', async () => {
      const event = cancelledEvents[0];
      const user = await createUser();
      await createAttendee(event, user);

      const { statusCode } = await request(app)
        .patch(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(200);
    });

    it('should return 400 if update exceeds event capacity', async () => {
      const event = await createEvent({ overrides: { capacity: 5 } });
      const user = await createUser();
      await createAttendee(event, user);

      const { statusCode } = await request(app)
        .patch(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`)
        .send({ guests: 5 });

      expect(statusCode).toBe(400);
    });

    it('should update attendee record', async () => {
      const event = await createEvent({ overrides: { capacity: 10 } });
      const user = await createUser();
      const attendee = await createAttendee(event, user);

      const { statusCode } = await request(app)
        .patch(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`)
        .send({ guests: 2 });

      expect(statusCode).toBe(200);

      const updatedAttendee = await Attendee.findById(attendee.id);
      expect(updatedAttendee.guests).toBe(2);
    });

    it('should return updated event', async () => {
      const event = await createEvent({ overrides: { capacity: 10 } });
      const user = await createUser();
      await createAttendee(event, user);

      const { statusCode, body } = await request(app)
        .patch(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`)
        .send({ guests: 2 });

      expect(statusCode).toBe(200);

      expect(body).toEqual({
        __v: 0,
        _id: event.id,
        attendees: [
          {
            __v: 0,
            _id: expect.any(String),
            createdAt: expect.any(String),
            event: event.id,
            guests: 2,
            id: expect.any(String),
            updatedAt: expect.any(String),
            user: {
              _id: user.id,
              firstName: user.firstName,
              id: user.id,
              isAdmin: user.isAdmin,
              lastName: user.lastName,
              name: user.name,
            },
          },
        ],
        authUserAttendee: null,
        capacity: event.capacity,
        category: event.category,
        createdAt: expect.any(String),
        id: event.id,
        isCancelled: false,
        isFinished: false,
        isFull: false,
        location: {
          name: event.location.name,
          line1: event.location.line1,
          line2: event.location.line2,
          town: event.location.town,
          postcode: event.location.postcode,
        },
        name: event.name,
        numAttendees: 3,
        time: {
          buildUp: event.time.buildUp.toISOString(),
          start: event.time.start.toISOString(),
          end: event.time.end.toISOString(),
        },
        updatedAt: expect.any(String),
      });
    });
  });

  describe('DELETE /api/events/:eventId/attendees/:userId', () => {
    const path = '/api/events/';

    it('should return 401 without authorization', async () => {
      const event = await createEvent();
      const user = await createUser();
      await createAttendee(event, user);

      const { statusCode } = await request(app).delete(
        path + event.id + '/attendees/' + user.id
      );

      expect(statusCode).toBe(401);
    });

    it('should return 403 without admin rights', async () => {
      const event = await createEvent();
      const user = await createUser();
      await createAttendee(event, user);

      const { statusCode } = await request(app)
        .delete(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(403);
    });

    it('should return 200 with authorization and admin rights', async () => {
      const event = await createEvent();
      const user = await createUser();
      await createAttendee(event, user);

      const { statusCode } = await request(app)
        .delete(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(200);
    });

    it('should return 404 if event does not exist', async () => {
      const notAnEventId = new mongoose.Types.ObjectId();
      const user = await createUser();

      const { statusCode } = await request(app)
        .delete(path + notAnEventId + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(404);
    });

    it('should return 400 if no attendee found', async () => {
      const event = await createEvent();
      const user = await createUser();

      const { statusCode } = await request(app)
        .delete(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(400);
    });

    it('should return 200 even if event has finished', async () => {
      const event = await createEvent({ past: true });
      const user = await createUser();
      await createAttendee(event, user);

      const { statusCode } = await request(app)
        .delete(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(200);
    });

    it('should return 200 even if event has been cancelled', async () => {
      const event = await createEvent({ overrides: { isCancelled: true } });
      const user = await createUser();
      await createAttendee(event, user);

      const { statusCode } = await request(app)
        .delete(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(200);
    });

    it('should remove attendee record', async () => {
      const event = await createEvent();
      const user = await createUser();
      const attendee = await createAttendee(event, user);

      const { statusCode } = await request(app)
        .delete(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(200);

      const attendeeAfter = await Attendee.findById(attendee.id);
      expect(attendeeAfter).toBeFalsy();
    });

    it('should return updated event', async () => {
      const event = await createEvent();
      const user = await createUser();
      await createAttendee(event, user);

      const { statusCode, body } = await request(app)
        .delete(path + event.id + '/attendees/' + user.id)
        .set('Authorization', `bearer ${authAdmin.accessToken}`);

      expect(statusCode).toBe(200);

      expect(body).toEqual({
        __v: 0,
        _id: event.id,
        attendees: [],
        authUserAttendee: null,
        capacity: event.capacity,
        category: event.category,
        createdAt: expect.any(String),
        id: event.id,
        isCancelled: false,
        isFinished: false,
        isFull: false,
        location: {
          name: event.location.name,
          line1: event.location.line1,
          line2: event.location.line2,
          town: event.location.town,
          postcode: event.location.postcode,
        },
        name: event.name,
        numAttendees: 0,
        time: {
          buildUp: event.time.buildUp.toISOString(),
          start: event.time.start.toISOString(),
          end: event.time.end.toISOString(),
        },
        updatedAt: expect.any(String),
      });
    });
  });
});
