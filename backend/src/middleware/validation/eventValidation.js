import { body } from 'express-validator';

// If the validator is exported directly the '.exists()' check will fail.
// Hence exported as an arrow function!

const guests = () => {
  return body('guests')
    .trim()
    .isNumeric()
    .isLength({ min: 1, max: 2 })
    .withMessage('Number of guests must be submitted.');
};

const buildUpTime = () => {
  return body('buildUpTime')
    .trim()
    .isISO8601()
    .withMessage('A valid build up date and time must be supplied.')
    .toDate();
};

const startTime = () => {
  return body('startTime')
    .trim()
    .isISO8601()
    .withMessage('A valid start date and time must be supplied.')
    .toDate();
};

const endTime = () => {
  return body('endTime')
    .trim()
    .isISO8601()
    .withMessage('A valid end date and time must be supplied.')
    .toDate();
};

const category = () => {
  return body('category')
    .trim()
    .escape()
    .isLength({ min: 1, max: 20 })
    .withMessage('An event category must be supplied.')
    .isAlphanumeric('en-GB')
    .withMessage('Invalid event category.');
};

const name = () => {
  return body('name')
    .trim()
    .escape()
    .isLength({ min: 1, max: 20 })
    .withMessage('An event name must be supplied.');
};

export default { guests, buildUpTime, startTime, endTime, category, name };
