import request from 'supertest';
import { isAfter, isBefore, isEqual, parseISO, add, sub } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz/esm';
import mongoose from 'mongoose';

import app from '../app';
import * as db from '../config/testDb';
import pwUtils from '../utils/password';
import * as data from '../testData';
import { Attendee, Event } from '../models';

const TIMEZONE = process.env.CLIENT_TZ || 'Europe/London';

describe('events', () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.close();
  });

  afterEach(async () => {
    await db.clear();
  });

  describe('GET /api/events', () => {
    const path = '/api/events';
    let authUser;
    let token;
    let events;

    beforeEach(async () => {
      authUser = await data.standardUser().save();
      token = pwUtils.issueJWT(authUser.id).token;
      events = await Promise.all(data.events().map((event) => event.save()));
    });

    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).get(path);
      expect(statusCode).toBe(401);
    });

    it('should return 200 with authorization', async () => {
      const { statusCode } = await request(app)
        .get(path)
        .set('Authorization', token);

      expect(statusCode).toBe(200);
    });

    it('should return json', async () => {
      const { statusCode, headers } = await request(app)
        .get(path)
        .set('Authorization', token);

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return events paginated in pages of 4', async () => {
      const { statusCode, body } = await request(app)
        .get(path)
        .set('Authorization', token);

      expect(statusCode).toBe(200);

      // expected events on page
      expect(body.limit).toBe(4);
      expect(body.docs.length).toBe(4);
    });

    it('should default to returning page 1 of upcoming or in-progress events', async () => {
      const { statusCode, body } = await request(app)
        .get(path)
        .set('Authorization', token);

      expect(statusCode).toBe(200);

      // expected events on page
      expect(body.totalDocs).toBe(5);
      expect(body.page).toBe(1);

      body.docs.forEach((event) => {
        expect(event.isFinished).toBeFalsy();
      });
    });

    it('query: "?page=n" --> should return page n of events', async () => {
      const { statusCode, body } = await request(app)
        .get(path + '?page=2')
        .set('Authorization', token);

      expect(statusCode).toBe(200);

      // expected events on page
      expect(body.page).toBe(2);
    });

    it('query: "?finished=true" --> should return only finished events', async () => {
      const { statusCode, body } = await request(app)
        .get(path + '?finished=true')
        .set('Authorization', token);

      expect(statusCode).toBe(200);

      body.docs.forEach((event) => {
        expect(event.isFinished).toBeTruthy();
      });
    });

    it('query: "?finished=false" --> should return only unfinished events', async () => {
      const { statusCode, body } = await request(app)
        .get(path + '?finished=false')
        .set('Authorization', token);

      expect(statusCode).toBe(200);

      body.docs.forEach((event) => {
        expect(event.isFinished).toBeFalsy();
      });
    });

    it('should return finished events in descending order of start time', async () => {
      const { statusCode, body } = await request(app)
        .get(path + '?finished=true')
        .set('Authorization', token);

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
        .set('Authorization', token);

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
        .set('Authorization', token);

      expect(statusCode).toBe(200);

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
    let authUser;
    let adminUser;
    let authToken;
    let adminToken;

    beforeEach(async () => {
      authUser = await data.standardUser().save();
      authToken = pwUtils.issueJWT(authUser.id).token;

      adminUser = await data.adminUser().save();
      adminToken = pwUtils.issueJWT(adminUser.id).token;
    });

    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).post(path);

      expect(statusCode).toBe(401);
    });

    it('should return 403 if the auth user is not an admin', async () => {
      const { statusCode } = await request(app)
        .post(path)
        .set('Authorization', authToken);

      expect(statusCode).toBe(403);
    });

    it('should return 200 if the auth user is an admin', async () => {
      const { statusCode } = await request(app)
        .post(path)
        .set('Authorization', adminToken)
        .send(data.requiredEventInput());

      expect(statusCode).toBe(200);
    });

    it('should return 400 if provided time is not in the future', async () => {
      const input = {
        ...data.requiredEventInput(),
        buildUpTime: sub(new Date(), { seconds: 1 }),
      };
      const { statusCode } = await request(app)
        .post(path)
        .set('Authorization', adminToken)
        .send(input);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if provided times are not in sequence', async () => {
      const now = new Date();

      const startBeforeBuildUp = {
        ...data.requiredEventInput(),
        buildUpTime: add(now, { days: 1, seconds: 1 }),
        startTime: add(now, { days: 1 }),
        endTime: add(now, { days: 1, seconds: 2 }),
      };

      const endBeforeStart = {
        ...data.requiredEventInput(),
        buildUpTime: add(now, { days: 1 }),
        startTime: add(now, { days: 1, seconds: 2 }),
        endTime: add(now, { days: 1, seconds: 1 }),
      };

      const { statusCode: statusCode1 } = await request(app)
        .post(path)
        .set('Authorization', adminToken)
        .send(startBeforeBuildUp);
      expect(statusCode1).toBe(400);

      const { statusCode: statusCode2 } = await request(app)
        .post(path)
        .set('Authorization', adminToken)
        .send(endBeforeStart);
      expect(statusCode2).toBe(400);
    });

    it('should return 400 if a required field is missing', async () => {
      const fields = data.requiredEventInput();

      const { buildUpTime, ...noBuildUpTime } = fields;
      const { startTime, ...noStartTime } = fields;
      const { endTime, ...noEndTime } = fields;
      const { category, ...noCategory } = fields;
      const { locationLine1, ...noLocationLine1 } = fields;
      const { locationTown, ...noLocationTown } = fields;
      const { locationPostcode, ...noLocationPostcode } = fields;

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
            .set('Authorization', adminToken)
            .send(input);
          expect(statusCode).toBe(400);
        })
      );
    });

    it('should return json', async () => {
      const { statusCode, headers } = await request(app)
        .post(path)
        .set('Authorization', adminToken)
        .send(data.requiredEventInput());

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return created event with correct fields', async () => {
      const input = data.fullEventInput();

      const { statusCode, body } = await request(app)
        .post(path)
        .set('Authorization', adminToken)
        .send(input);

      expect(statusCode).toBe(200);

      expect(body).toEqual({
        __v: 0,
        _id: expect.any(String),
        capacity: input.capacity,
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
    let authUser;
    let authToken;
    let events;
    let event;

    beforeEach(async () => {
      authUser = await data.standardUser().save();
      authToken = pwUtils.issueJWT(authUser.id).token;

      events = await Promise.all(data.events().map((e) => e.save()));
      event = events[0];
    });

    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).get(path + event.id);

      expect(statusCode).toBe(401);
    });

    it('should return 200 with authorization', async () => {
      const { statusCode } = await request(app)
        .get(path + event.id)
        .set('Authorization', authToken);

      expect(statusCode).toBe(200);
    });

    it('should return 400 with an invalid event id', async () => {
      const { statusCode } = await request(app)
        .get(path + 'notanid')
        .set('Authorization', authToken);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if the event is not found', async () => {
      const { statusCode } = await request(app)
        .get(path + new mongoose.Types.ObjectId().toString())
        .set('Authorization', authToken);

      expect(statusCode).toBe(401);
    });

    it('should return json', async () => {
      const { statusCode, headers } = await request(app)
        .get(path + event.id)
        .set('Authorization', authToken);

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return event with correct fields', async () => {
      const { statusCode, body } = await request(app)
        .get(path + event.id)
        .set('Authorization', authToken);

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
    let authUser;
    let authToken;
    let events;
    let event;

    beforeEach(async () => {
      authUser = await data.standardUser().save();
      authToken = pwUtils.issueJWT(authUser.id).token;

      events = await Promise.all(data.events().map((e) => e.save()));
      event = events.find((e) => e.name === 'Future Event E');
    });

    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).get(path);

      expect(statusCode).toBe(401);
    });

    it('should return 200 with authorization', async () => {
      const { statusCode } = await request(app)
        .get(path)
        .set('Authorization', authToken);

      expect(statusCode).toBe(200);
    });

    it('should return null if no upcoming match is found', async () => {
      // remove all upcoming matches
      await Event.deleteMany({
        category: 'match',
        'time.end': { $gte: sub(new Date(), { hours: 1 }) },
      });

      const { statusCode, body } = await request(app)
        .get(path)
        .set('Authorization', authToken);

      expect(statusCode).toBe(200);
      expect(body).toBe(null);
    });

    it('should return json', async () => {
      const { statusCode, headers } = await request(app)
        .get(path)
        .set('Authorization', authToken);

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return correct event with correct fields', async () => {
      const { statusCode, body } = await request(app)
        .get(path)
        .set('Authorization', authToken);

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

  describe('PUT /api/events/:eventId', () => {
    const path = '/api/events/';
    let authUser;
    let authToken;
    let adminUser;
    let adminToken;
    let events;
    let event;

    beforeEach(async () => {
      authUser = await data.standardUser().save();
      authToken = pwUtils.issueJWT(authUser.id).token;

      adminUser = await data.adminUser().save();
      adminToken = pwUtils.issueJWT(adminUser.id).token;

      events = await Promise.all(data.events().map((e) => e.save()));
      event = events.find((e) => e.name === 'Future Event E');
    });

    it('should return 401 without authentication', async () => {
      const { statusCode } = await request(app).put(path + event.id);

      expect(statusCode).toBe(401);
    });

    it('should return 403 without admin rights', async () => {
      const { statusCode } = await request(app)
        .put(path + event.id)
        .set('Authorization', authToken);

      expect(statusCode).toBe(403);
    });

    it('should return 200 with authentication and admin rights', async () => {
      const { statusCode } = await request(app)
        .put(path + event.id)
        .set('Authorization', adminToken)
        .send({});

      expect(statusCode).toBe(200);
    });

    it('should return json', async () => {
      const { statusCode, headers } = await request(app)
        .put(path + event.id)
        .set('Authorization', adminToken)
        .send({});

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return updated event with correct fields', async () => {
      const update = data.eventUpdate();

      const { statusCode, body } = await request(app)
        .put(path + event.id)
        .set('Authorization', adminToken)
        .send(update);

      expect(statusCode).toBe(200);

      expect(body).toEqual({
        __v: 0,
        _id: event.id,
        attendees: [],
        authUserAttendee: null,
        capacity: update.capacity,
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
    let authUser;
    let authToken;
    let adminUser;
    let adminToken;
    let events;
    let event;

    beforeEach(async () => {
      authUser = await data.standardUser().save();
      authToken = pwUtils.issueJWT(authUser.id).token;

      adminUser = await data.adminUser().save();
      adminToken = pwUtils.issueJWT(adminUser.id).token;

      events = await Promise.all(data.events().map((e) => e.save()));
      event = events.find((e) => e.name === 'Future Event E');
    });

    it('should return 401 without authentication', async () => {
      const { statusCode } = await request(app).delete(path + event.id);

      expect(statusCode).toBe(401);
    });

    it('should return 403 without admin rights', async () => {
      const { statusCode } = await request(app)
        .delete(path + event.id)
        .set('Authorization', authToken);

      expect(statusCode).toBe(403);
    });

    it('should return 200 with authentication and admin rights', async () => {
      const { statusCode } = await request(app)
        .delete(path + event.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(200);
    });

    it('should remove event from database', async () => {
      const { statusCode } = await request(app)
        .delete(path + event.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(200);

      const found = await Event.findById(event.id);

      expect(found).toBeFalsy();
    });

    it('should return json', async () => {
      const { statusCode, headers } = await request(app)
        .delete(path + event.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return updated event with correct fields', async () => {
      const { statusCode, body } = await request(app)
        .delete(path + event.id)
        .set('Authorization', adminToken);

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
    let authUser;
    let authToken;
    let events;
    let event;

    beforeEach(async () => {
      authUser = await data.standardUser().save();
      authToken = pwUtils.issueJWT(authUser.id).token;

      events = await Promise.all(data.events().map((e) => e.save()));
      event = events.find((e) => e.name === 'Future Event E');
    });

    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).post(
        path + event.id + '/attendees/me'
      );

      expect(statusCode).toBe(401);
    });

    it('should return 200 with authorization', async () => {
      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/me')
        .set('Authorization', authToken);

      expect(statusCode).toBe(200);
    });

    it('should return 404 if event does not exist', async () => {
      const notAnEventId = new mongoose.Types.ObjectId();

      const { statusCode } = await request(app)
        .post(path + notAnEventId + '/attendees/me')
        .set('Authorization', authToken);

      expect(statusCode).toBe(404);
    });

    it('should return 400 if auth user already registered for event', async () => {
      await new Attendee({
        event: event.id,
        user: authUser.id,
      }).save();

      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/me')
        .set('Authorization', authToken);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if event has finished', async () => {
      const finishedEvent = events.find((e) => e.name === 'Past Event A');

      const { statusCode } = await request(app)
        .post(path + finishedEvent.id + '/attendees/me')
        .set('Authorization', authToken);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if event has been cancelled', async () => {
      const cancelledEvent = events.find((e) => e.name === 'Future Event D');

      const { statusCode } = await request(app)
        .post(path + cancelledEvent.id + '/attendees/me')
        .set('Authorization', authToken);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if event is full', async () => {
      // fill event
      const users = await Promise.all(data.users().map((user) => user.save()));
      await Promise.all(
        users.map((u) =>
          new Attendee({
            user: u.id,
            event: event.id,
          }).save()
        )
      );

      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/me')
        .set('Authorization', authToken);

      expect(statusCode).toBe(400);
    });

    it('should add auth user to event', async () => {
      const attendeeBefore = await Attendee.find({
        user: authUser.id,
        event: event.id,
      });
      expect(attendeeBefore.length).toBe(0);

      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/me')
        .set('Authorization', authToken);

      expect(statusCode).toBe(200);

      const attendeeAfter = await Attendee.find({
        user: authUser.id,
        event: event.id,
      });
      expect(attendeeAfter.length).toBe(1);
    });

    it('should return updated event', async () => {
      const { statusCode, body } = await request(app)
        .post(path + event.id + '/attendees/me')
        .set('Authorization', authToken);

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
              _id: authUser.id,
              firstName: authUser.firstName,
              id: authUser.id,
              isAdmin: authUser.isAdmin,
              lastName: authUser.lastName,
              name: authUser.name,
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
            _id: authUser.id,
            firstName: authUser.firstName,
            id: authUser.id,
            isAdmin: authUser.isAdmin,
            lastName: authUser.lastName,
            name: authUser.name,
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

  describe('PUT /api/events/:eventId/attendees/me', () => {
    const path = '/api/events/';
    let authUser;
    let authToken;
    let events;
    let event;
    let attendee;

    beforeEach(async () => {
      authUser = await data.standardUser().save();
      authToken = pwUtils.issueJWT(authUser.id).token;

      events = await Promise.all(data.events().map((e) => e.save()));
      event = events.find((e) => e.name === 'Future Event E');

      // add auth user to event
      attendee = await new Attendee({
        event: event.id,
        user: authUser.id,
      }).save();
    });

    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).put(
        path + event.id + '/attendees/me'
      );

      expect(statusCode).toBe(401);
    });

    it('should return 200 with authorization', async () => {
      const { statusCode } = await request(app)
        .put(path + event.id + '/attendees/me')
        .set('Authorization', authToken);

      expect(statusCode).toBe(200);
    });

    it('should return 404 if event does not exist', async () => {
      const notAnEventId = new mongoose.Types.ObjectId();

      const { statusCode } = await request(app)
        .put(path + notAnEventId + '/attendees/me')
        .set('Authorization', authToken);

      expect(statusCode).toBe(404);
    });

    it('should return 400 if auth user not registered for event', async () => {
      await Attendee.findByIdAndDelete(attendee.id);

      const { statusCode } = await request(app)
        .put(path + event.id + '/attendees/me')
        .set('Authorization', authToken);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if event has finished', async () => {
      const finishedEvent = events.find((e) => e.name === 'Past Event A');

      // add auth user to event
      attendee = await new Attendee({
        event: finishedEvent.id,
        user: authUser.id,
      }).save();

      const { statusCode } = await request(app)
        .put(path + finishedEvent.id + '/attendees/me')
        .set('Authorization', authToken);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if event has been cancelled', async () => {
      const cancelledEvent = events.find((e) => e.name === 'Future Event D');

      // add auth user to event
      attendee = await new Attendee({
        event: cancelledEvent.id,
        user: authUser.id,
      }).save();

      const { statusCode } = await request(app)
        .put(path + cancelledEvent.id + '/attendees/me')
        .set('Authorization', authToken);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if update exceeds event capacity', async () => {
      const { statusCode } = await request(app)
        .put(path + event.id + '/attendees/me')
        .set('Authorization', authToken)
        .send({ guests: 3 });

      expect(statusCode).toBe(400);
    });

    it('should update auth user attendee', async () => {
      const { statusCode } = await request(app)
        .put(path + event.id + '/attendees/me')
        .set('Authorization', authToken)
        .send({ guests: 2 });

      expect(statusCode).toBe(200);

      attendee = await Attendee.findById(attendee.id);
      expect(attendee.guests).toBe(2);
    });

    it('should return updated event', async () => {
      const { statusCode, body } = await request(app)
        .put(path + event.id + '/attendees/me')
        .set('Authorization', authToken)
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
              _id: authUser.id,
              firstName: authUser.firstName,
              id: authUser.id,
              isAdmin: authUser.isAdmin,
              lastName: authUser.lastName,
              name: authUser.name,
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
            _id: authUser.id,
            firstName: authUser.firstName,
            id: authUser.id,
            isAdmin: authUser.isAdmin,
            lastName: authUser.lastName,
            name: authUser.name,
          },
        },
        capacity: event.capacity,
        category: event.category,
        createdAt: expect.any(String),
        id: event.id,
        isCancelled: false,
        isFinished: false,
        isFull: true,
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
    let authUser;
    let authToken;
    let events;
    let event;
    let attendee;

    beforeEach(async () => {
      authUser = await data.standardUser().save();
      authToken = pwUtils.issueJWT(authUser.id).token;

      events = await Promise.all(data.events().map((e) => e.save()));
      event = events.find((e) => e.name === 'Future Event E');

      // add auth user to event
      attendee = await new Attendee({
        event: event.id,
        user: authUser.id,
      }).save();
    });

    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).delete(
        path + event.id + '/attendees/me'
      );

      expect(statusCode).toBe(401);
    });

    it('should return 200 with authorization', async () => {
      const { statusCode } = await request(app)
        .delete(path + event.id + '/attendees/me')
        .set('Authorization', authToken);

      expect(statusCode).toBe(200);
    });

    it('should return 404 if event does not exist', async () => {
      const notAnEventId = new mongoose.Types.ObjectId();

      const { statusCode } = await request(app)
        .delete(path + notAnEventId + '/attendees/me')
        .set('Authorization', authToken);

      expect(statusCode).toBe(404);
    });

    it('should return 400 if auth user not registered for event', async () => {
      await Attendee.findByIdAndDelete(attendee.id);

      const { statusCode } = await request(app)
        .delete(path + event.id + '/attendees/me')
        .set('Authorization', authToken);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if event has finished', async () => {
      const finishedEvent = events.find((e) => e.name === 'Past Event A');

      // add auth user to event
      attendee = await new Attendee({
        event: finishedEvent.id,
        user: authUser.id,
      }).save();

      const { statusCode } = await request(app)
        .delete(path + finishedEvent.id + '/attendees/me')
        .set('Authorization', authToken);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if event has been cancelled', async () => {
      const cancelledEvent = events.find((e) => e.name === 'Future Event D');

      // add auth user to event
      attendee = await new Attendee({
        event: cancelledEvent.id,
        user: authUser.id,
      }).save();

      const { statusCode } = await request(app)
        .delete(path + cancelledEvent.id + '/attendees/me')
        .set('Authorization', authToken);

      expect(statusCode).toBe(400);
    });

    it('should remove auth user attendee record', async () => {
      const attendeeBefore = await Attendee.findById(attendee.id);
      expect(attendeeBefore).toBeTruthy();

      const { statusCode } = await request(app)
        .delete(path + event.id + '/attendees/me')
        .set('Authorization', authToken);

      expect(statusCode).toBe(200);

      const attendeeAfter = await Attendee.findById(attendee.id);
      expect(attendeeAfter).toBeFalsy();
    });

    it('should return updated event', async () => {
      const { statusCode, body } = await request(app)
        .delete(path + event.id + '/attendees/me')
        .set('Authorization', authToken);

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
    let authUser;
    let authToken;
    let adminUser;
    let adminToken;
    let events;
    let event;
    let users;
    let user;

    beforeEach(async () => {
      authUser = await data.standardUser().save();
      authToken = pwUtils.issueJWT(authUser.id).token;

      adminUser = await data.adminUser().save();
      adminToken = pwUtils.issueJWT(adminUser.id).token;

      events = await Promise.all(data.events().map((e) => e.save()));
      event = events.find((e) => e.name === 'Future Event E');

      users = await Promise.all(data.users().map((u) => u.save()));
      user = users.find((u) => u.name === 'John Smith');
    });

    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).post(
        path + event.id + '/attendees/' + user.id
      );

      expect(statusCode).toBe(401);
    });

    it('should return 403 without admin rights', async () => {
      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/' + user.id)
        .set('Authorization', authToken);

      expect(statusCode).toBe(403);
    });

    it('should return 200 with authorization and admin rights', async () => {
      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/' + user.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(200);
    });

    it('should return 404 if event does not exist', async () => {
      const notAnEventId = new mongoose.Types.ObjectId();

      const { statusCode } = await request(app)
        .post(path + notAnEventId + '/attendees/' + user.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(404);
    });

    it('should return 400 if attendee already exists', async () => {
      await new Attendee({
        event: event.id,
        user: user.id,
      }).save();

      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/' + user.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(400);
    });

    it('should return 200 even if event has finished', async () => {
      const finishedEvent = events.find((e) => e.name === 'Past Event A');

      const { statusCode } = await request(app)
        .post(path + finishedEvent.id + '/attendees/' + user.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(200);
    });

    it('should return 200 even if event has been cancelled', async () => {
      const cancelledEvent = events.find((e) => e.name === 'Future Event D');

      const { statusCode } = await request(app)
        .post(path + cancelledEvent.id + '/attendees/' + user.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(200);
    });

    it('should return 400 if event is full', async () => {
      // fill event
      await Promise.all(
        users.map((u) =>
          new Attendee({
            user: u.id,
            event: event.id,
          }).save()
        )
      );

      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/' + user.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(400);
    });

    it('should create attendee for given event and user', async () => {
      const attendeeBefore = await Attendee.find({
        user: user.id,
        event: event.id,
      });

      expect(attendeeBefore.length).toBe(0);

      const { statusCode } = await request(app)
        .post(path + event.id + '/attendees/' + user.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(200);

      const attendeeAfter = await Attendee.find({
        user: user.id,
        event: event.id,
      });

      expect(attendeeAfter.length).toBe(1);
      expect(attendeeAfter[0].user.toString()).toBe(user.id);
      expect(attendeeAfter[0].event.toString()).toBe(event.id);
    });

    it('should return updated event', async () => {
      const { statusCode, body } = await request(app)
        .post(path + event.id + '/attendees/' + user.id)
        .set('Authorization', adminToken);

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

  describe('PUT /api/events/:eventId/attendees/:userId', () => {
    const path = '/api/events/';
    let authUser;
    let authToken;
    let adminUser;
    let adminToken;
    let events;
    let event;
    let users;
    let user;
    let attendee;

    beforeEach(async () => {
      authUser = await data.standardUser().save();
      authToken = pwUtils.issueJWT(authUser.id).token;

      adminUser = await data.adminUser().save();
      adminToken = pwUtils.issueJWT(adminUser.id).token;

      events = await Promise.all(data.events().map((e) => e.save()));
      event = events.find((e) => e.name === 'Future Event E');

      users = await Promise.all(data.users().map((u) => u.save()));
      user = users.find((u) => u.name === 'John Smith');

      // add user to event
      attendee = await new Attendee({
        event: event.id,
        user: user.id,
      }).save();
    });

    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).put(
        path + event.id + '/attendees/' + user.id
      );

      expect(statusCode).toBe(401);
    });

    it('should return 403 without admin rights', async () => {
      const { statusCode } = await request(app)
        .put(path + event.id + '/attendees/' + user.id)
        .set('Authorization', authToken);

      expect(statusCode).toBe(403);
    });

    it('should return 200 with authorization and admin rights', async () => {
      const { statusCode } = await request(app)
        .put(path + event.id + '/attendees/' + user.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(200);
    });

    it('should return 404 if event does not exist', async () => {
      const notAnEventId = new mongoose.Types.ObjectId();

      const { statusCode } = await request(app)
        .put(path + notAnEventId + '/attendees/' + user.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(404);
    });

    it('should return 400 if attendee record not found', async () => {
      await Attendee.findByIdAndDelete(attendee.id);

      const { statusCode } = await request(app)
        .put(path + event.id + '/attendees/' + user.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(400);
    });

    it('should return 200 even if event has finished', async () => {
      const finishedEvent = events.find((e) => e.name === 'Past Event A');

      // add user to event
      attendee = await new Attendee({
        event: finishedEvent.id,
        user: user.id,
      }).save();

      const { statusCode } = await request(app)
        .put(path + event.id + '/attendees/' + user.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(200);
    });

    it('should return 200 even if event has been cancelled', async () => {
      const cancelledEvent = events.find((e) => e.name === 'Future Event D');

      // add user to event
      attendee = await new Attendee({
        event: cancelledEvent.id,
        user: user.id,
      }).save();

      const { statusCode } = await request(app)
        .put(path + cancelledEvent.id + '/attendees/' + user.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(200);
    });

    it('should return 400 if update exceeds event capacity', async () => {
      const { statusCode } = await request(app)
        .put(path + event.id + '/attendees/' + user.id)
        .set('Authorization', adminToken)
        .send({ guests: 3 });

      expect(statusCode).toBe(400);
    });

    it('should update attendee record', async () => {
      const { statusCode } = await request(app)
        .put(path + event.id + '/attendees/' + user.id)
        .set('Authorization', adminToken)
        .send({ guests: 2 });

      expect(statusCode).toBe(200);

      attendee = await Attendee.findById(attendee.id);
      expect(attendee.guests).toBe(2);
    });

    it('should return updated event', async () => {
      const { statusCode, body } = await request(app)
        .put(path + event.id + '/attendees/' + user.id)
        .set('Authorization', adminToken)
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
        isFull: true,
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
    let authUser;
    let authToken;
    let adminUser;
    let adminToken;
    let events;
    let event;
    let users;
    let user;
    let attendee;

    beforeEach(async () => {
      authUser = await data.standardUser().save();
      authToken = pwUtils.issueJWT(authUser.id).token;

      adminUser = await data.adminUser().save();
      adminToken = pwUtils.issueJWT(adminUser.id).token;

      events = await Promise.all(data.events().map((e) => e.save()));
      event = events.find((e) => e.name === 'Future Event E');

      users = await Promise.all(data.users().map((u) => u.save()));
      user = users.find((u) => u.name === 'John Smith');

      // add user to event
      attendee = await new Attendee({
        event: event.id,
        user: user.id,
      }).save();
    });

    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).delete(
        path + event.id + '/attendees/' + user.id
      );

      expect(statusCode).toBe(401);
    });

    it('should return 403 without admin rights', async () => {
      const { statusCode } = await request(app)
        .delete(path + event.id + '/attendees/' + user.id)
        .set('Authorization', authToken);

      expect(statusCode).toBe(403);
    });

    it('should return 200 with authorization and admin rights', async () => {
      const { statusCode } = await request(app)
        .delete(path + event.id + '/attendees/' + user.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(200);
    });

    it('should return 404 if event does not exist', async () => {
      const notAnEventId = new mongoose.Types.ObjectId();

      const { statusCode } = await request(app)
        .delete(path + notAnEventId + '/attendees/' + user.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(404);
    });

    it('should return 400 if no attendee found', async () => {
      await Attendee.findByIdAndDelete(attendee.id);

      const { statusCode } = await request(app)
        .delete(path + event.id + '/attendees/' + user.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(400);
    });

    it('should return 200 even if event has finished', async () => {
      const finishedEvent = events.find((e) => e.name === 'Past Event A');

      // add user to event
      attendee = await new Attendee({
        event: finishedEvent.id,
        user: user.id,
      }).save();

      const { statusCode } = await request(app)
        .delete(path + finishedEvent.id + '/attendees/' + user.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(200);
    });

    it('should return 200 even if event has been cancelled', async () => {
      const cancelledEvent = events.find((e) => e.name === 'Future Event D');

      // add user to event
      attendee = await new Attendee({
        event: cancelledEvent.id,
        user: user.id,
      }).save();

      const { statusCode } = await request(app)
        .delete(path + cancelledEvent.id + '/attendees/' + user.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(200);
    });

    it('should remove attendee record', async () => {
      const attendeeBefore = await Attendee.findById(attendee.id);
      expect(attendeeBefore).toBeTruthy();

      const { statusCode } = await request(app)
        .delete(path + event.id + '/attendees/' + user.id)
        .set('Authorization', adminToken);

      expect(statusCode).toBe(200);

      const attendeeAfter = await Attendee.findById(attendee.id);
      expect(attendeeAfter).toBeFalsy();
    });

    it('should return updated event', async () => {
      const { statusCode, body } = await request(app)
        .delete(path + event.id + '/attendees/' + user.id)
        .set('Authorization', adminToken);

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
