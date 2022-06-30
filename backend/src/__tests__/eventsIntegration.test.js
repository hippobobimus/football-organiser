import request from 'supertest';
import { isAfter, isBefore, isEqual, parseISO, add, sub } from 'date-fns';
import mongoose from 'mongoose';

import app from '../app';
import * as db from '../config/testDb';
import pwUtils from '../utils/password';
import * as data from '../testData';
import { Event } from '../models';

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

      for (const input of [
        noBuildUpTime,
        noStartTime,
        noEndTime,
        noCategory,
        noLocationLine1,
        noLocationTown,
        noLocationPostcode,
      ]) {
        const { statusCode } = await request(app)
          .post(path)
          .set('Authorization', adminToken)
          .send(input);
        expect(statusCode).toBe(400);
      }
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
          buildUp: input.buildUpTime.toISOString(),
          start: input.startTime.toISOString(),
          end: input.endTime.toISOString(),
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

  // TODO
  //
  // PUT /api/events/:eventId
  // DELETE /api/events/:eventId
  // POST /api/events/:eventId/attendees/me
  // DELETE /api/events/:eventId/attendees/me
  // PUT /api/events/:eventId/attendees/me
  // POST /api/events/:eventId/attendees/:userId
  // PUT /api/events/:eventId/attendees/:userId
  // DELETE /api/events/:eventId/attendees/:userId
});
