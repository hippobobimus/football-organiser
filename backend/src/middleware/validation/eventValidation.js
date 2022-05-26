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

export default { guests };
