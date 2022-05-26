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

export default { guests, buildUpTime, startTime, endTime };
