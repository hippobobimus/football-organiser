import { body } from 'express-validator';

const firstName = body('firstName')
  .trim()
  .isLength({ min: 1, max: 100 })
  .escape()
  .withMessage('First name must be specified.')
  .isAlphanumeric('en-GB', { ignore: "'-" })
  .withMessage(
    'First name has invalid characters (a-z, A-Z, hyphenation and apostrophes only).'
  );

const lastName = body('lastName')
  .trim()
  .isLength({ min: 1, max: 100 })
  .escape()
  .withMessage('Last name must be specified.')
  .isAlphanumeric('en-GB', { ignore: "'-" })
  .withMessage(
    'Last name has invalid characters (a-z, A-Z, hyphenation and apostrophes only).'
  );

const email = body('email')
  .isEmail()
  .withMessage('A valid email address must be provided.');

const strongPassword = body('password')
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
    'A strong password must be provided. Minimum length 8 characters including at least 1 lower case and 1 upper case character, 1 number and 1 symbol.'
  );

export default { firstName, lastName, email, strongPassword };
