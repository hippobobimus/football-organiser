import { body, validationResult } from 'express-validator';
import createError from 'http-errors';

import { User } from '../models';

const validateAndSanitiseInput = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric('en-GB', { ignore: "'-" })
    .withMessage(
      'First name has invalid characters (a-z, capitalisation, hyphenation and apostrophes only).'
    ),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage('Last name must be specified.')
    .isAlphanumeric('en-GB', { ignore: "'-" })
    .withMessage(
      'Last name has invalid characters (a-z, capitalisation, hyphenation and apostrophes only).'
    ),
];

// @desc    Get users
// @route   GET /api/users
// @access  Private
const readUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private
const createUser = [
  validateAndSanitiseInput,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(
        createError(400, 'Field validation failed.', {
          fieldValidationErrors: errors.errors,
        })
      );
    }

    try {
      const user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });
      return res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Get a user
// @route   GET /api/users/:id
// @access  Private
const readUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

// @desc    Edit user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = [
  validateAndSanitiseInput.map((m) => m.optional({ nullable: true })),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(
        createError(400, 'Field validation failed.', {
          fieldValidationErrors: errors.errors,
        })
      );
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: 'after',
      });
      return res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = (req, res, next) => {
  // TODO
  res.status(200).json({ message: `Delete user; id=${req.params.id}` });
};

export default { readUsers, createUser, readUser, updateUser, deleteUser };
