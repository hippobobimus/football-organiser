import { body, param } from 'express-validator';
import mongoose from 'mongoose';
import { zonedTimeToUtc } from 'date-fns-tz/esm';

// If the validator is exported directly the '.exists()' check will fail.
// Hence exported as an arrow function!

const TIMEZONE = 'Europe/London';

const eventId = () => {
  return param('eventId')
    .trim()
    .custom((id) => mongoose.isObjectIdOrHexString(id))
    .withMessage('A valid event id must be given.');
};

const userId = () => {
  return param('userId')
    .trim()
    .custom((id) => mongoose.isObjectIdOrHexString(id))
    .withMessage('A valid user id must be given.');
};

const guests = () => {
  return body('guests')
    .trim()
    .isNumeric()
    .isLength({ min: 1, max: 2 })
    .withMessage('Number of guests between 0-99 must be submitted.');
};

const buildUpTime = () => {
  return body('buildUpTime')
    .trim()
    .isISO8601()
    .withMessage('A valid build up date and time must be supplied.')
    .customSanitizer((val) => zonedTimeToUtc(val, TIMEZONE))
    .isAfter()
    .withMessage('Cannot be in the past.')
    .toDate();
};

const startTime = () => {
  return body('startTime')
    .trim()
    .isISO8601()
    .withMessage('A valid start date and time must be supplied.')
    .customSanitizer((val) => zonedTimeToUtc(val, TIMEZONE))
    .isAfter()
    .withMessage('Cannot be in the past.')
    .toDate();
};

const endTime = () => {
  return body('endTime')
    .trim()
    .isISO8601()
    .withMessage('A valid end date and time must be supplied.')
    .customSanitizer((val) => zonedTimeToUtc(val, TIMEZONE))
    .isAfter()
    .withMessage('Cannot be in the past.')
    .toDate();
};

const category = () => {
  return body('category')
    .trim()
    .escape()
    .matches(/^(match|social)$/i)
    .withMessage('Invalid event category.');
};

const name = () => {
  return body('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('An event name must be supplied.')
    .isLength({ min: 1, max: 20 })
    .withMessage('Maximum event name length of 20 characters.');
};

const locationName = () => {
  return body('locationName')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Location name is required.')
    .isLength({ min: 1, max: 20 })
    .withMessage(
      'A location name of less than 20 characters must be supplied.'
    );
};

const locationLine1 = () => {
  return body('locationLine1')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Address line 1 is required.')
    .isLength({ min: 1, max: 30 })
    .withMessage(
      'The first line of the address must be less than 30 characters.'
    );
};

const locationLine2 = () => {
  return body('locationLine2')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Address line 2 is required.')
    .isLength({ min: 1, max: 30 })
    .withMessage(
      'The second line of the address must be less than 30 characters.'
    );
};

const locationTown = () => {
  return body('locationTown')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Address town is required.')
    .isLength({ min: 1, max: 30 })
    .withMessage('The address town must be less than 30 characters.');
};

const locationPostcode = () => {
  return body('locationPostcode')
    .trim()
    .escape()
    .isPostalCode('GB')
    .withMessage('Must be a valid UK postcode format.');
};

const capacity = () => {
  return body('capacity')
    .trim()
    .escape()
    .isInt()
    .withMessage('Capacity must be a valid integer value.')
    .toInt();
};

const isCancelled = () => {
  return body('isCancelled')
    .trim()
    .isBoolean()
    .withMessage('A boolean value must be supplied.')
    .toBoolean();
};

export default {
  eventId,
  userId,
  guests,
  buildUpTime,
  startTime,
  endTime,
  category,
  name,
  locationName,
  locationLine1,
  locationLine2,
  locationTown,
  locationPostcode,
  capacity,
  isCancelled,
};
