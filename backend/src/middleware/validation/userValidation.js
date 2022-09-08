import { body } from 'express-validator';

// If the validator is exported directly the '.exists()' check will fail.
// Hence exported as an arrow function!

const firstName = () => {
  return body('firstName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage('First name must be specified.');
};

const lastName = () => {
  return body('lastName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage('Last name must be specified.');
};

const email = () => {
  return body('email')
    .isEmail()
    .withMessage('The provided email address is invalid.');
};

const newPassword = () => {
  return body('newPassword')
    .trim()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    })
    .withMessage(
      'A strong new password must be provided. Minimum length 8 characters including at least 1 lower case and 1 upper case character, 1 number and 1 symbol.'
    );
};

const currentPassword = () => {
  return body('currentPassword')
    .exists()
    .withMessage('Your current password must be provided.')
    .trim();
};

export default { firstName, lastName, email, currentPassword, newPassword };
