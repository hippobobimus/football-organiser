import { validationResult } from 'express-validator';
import createError from 'http-errors';

import { User } from '../models';
import validate from '../middleware/validation';
import {
  authenticatePassword,
  generatePassword,
  issueJWT,
} from '../utils/password';

// @desc    Create user
// @route   POST /api/users
// @access  Public
const createUser = [
  validate.firstName,
  validate.lastName,
  validate.email,
  validate.strongPassword,
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
      const foundUser = await User.findOne({ email: req.body.email });
      if (foundUser) {
        return next(createError(400, 'User already exists.'))
      }
    } catch (err) {
      return next(err);
    }

    const { hash, salt } = generatePassword(req.body.password);

    try {
      const user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: { hash, salt },
      });

      const { token } = issueJWT(user.id);

      return res.status(200).json({
        user: token,
      });
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Login a user
// @route   POST /api/users/:id/login
// @access  Public
const loginUser = [
  validate.email,
  validate.strongPassword,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(
        createError(400, 'Field validation failed.', {
          fieldValidationErrors: errors.errors,
        })
      );
    }

    let user;
    try {
      user = await User.findOne({ email: req.body.email });
    } catch (err) {
      return next(err);
    }

    if (!user) {
      return next(createError(401, 'Invalid email or password'));
    }

    const authenticated = authenticatePassword(
      req.body.password,
      user.password.hash,
      user.password.salt
    );

    if (!authenticated) {
      return next(createError(401, 'Invalid email or password'));
    }

    const jwt = issueJWT(user);

    return res
      .status(200)
      .json({
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        jwt,
      });
  },
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
  validate.firstName.optional({ nullable: true }),
  validate.lastName.optional({ nullable: true }),
  validate.email.optional({ nullable: true }),
  validate.strongPassword.optional({ nullable: true }),
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

export default {
  createUser,
  loginUser,
  readUsers,
  readUser,
  updateUser,
  deleteUser,
};
