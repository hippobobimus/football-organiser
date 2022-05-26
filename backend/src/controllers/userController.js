import { validationResult } from 'express-validator';
import createError from 'http-errors';

import { User } from '../models';
import validate from '../middleware/validation/userValidation';
import {
  authenticatePassword,
  generatePassword,
  issueJWT,
} from '../utils/password';

// @desc    Create user
// @route   POST /api/users
// @access  Public
const createUser = [
  validate.firstName(),
  validate.lastName(),
  validate.email(),
  validate.newPassword(),
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
        return next(createError(400, 'User already exists.'));
      }
    } catch (err) {
      return next(err);
    }

    const { hash, salt } = generatePassword(req.body.newPassword);

    try {
      const user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: { hash, salt },
      });

      const { token } = issueJWT(user.id);

      return res.status(200).json({
        token,
      });
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const loginUser = [
  validate.email(),
  validate.currentPassword(),
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
      req.body.currentPassword,
      user.password.hash,
      user.password.salt
    );

    if (!authenticated) {
      return next(createError(401, 'Invalid email or password'));
    }

    const { token } = issueJWT(user);

    return res.status(200).json({
      token,
    });
  },
];

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
const readCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

// @desc    Edit current user
// @route   PUT /api/users/me
// @access  Private
const updateCurrentUser = [
  validate.firstName().optional({ checkFalsy: true }),
  validate.lastName().optional({ checkFalsy: true }),
  validate.email().optional({ checkFalsy: true }),
  validate.newPassword().optional({ checkFalsy: true }),
  validate.currentPassword(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const message = errors.errors.map((err) => err.msg).join(' ');
      return next(
        createError(400, message, {
          fieldValidationErrors: errors.errors,
        })
      );
    }

    let user;
    try {
      user = await User.findById(req.user.id);
    } catch (err) {
      return next(err);
    }

    if (!user) {
      return next(createError(401, 'User does not exist.'));
    }

    // Re-authenticate user.
    const authenticated = authenticatePassword(
      req.body.currentPassword,
      user.password.hash,
      user.password.salt
    );
    if (!authenticated) {
      return next(createError(401, 'Invalid password.'));
    }

    // Update fields.
    if (req.body.firstName) {
      user.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      user.lastName = req.body.lastName;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.newPassword) {
      user.password = generatePassword(req.body.newPassword);
    }

    try {
      user = await user.save();
    } catch (err) {
      return next(err);
    }

    // return updated user.
    return res.status(200).json(user);
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

// TODO following currently unused.
//
// // @desc    Get a user
// // @route   GET /api/users/:id
// // @access  Private
// const readUser = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.params.id);
//     return res.status(200).json(user);
//   } catch (err) {
//     return next(err);
//   }
// };
//
// // @desc    Edit user
// // @route   PUT /api/users/:id
// // @access  Private
// const updateUser = [
//   validate.firstName().optional({ nullable: true }),
//   validate.lastName.optional({ nullable: true }),
//   validate.email.optional({ nullable: true }),
//   validate.currentPassword().optional({ nullable: true }),
//   async (req, res, next) => {
//     const errors = validationResult(req);
//
//     if (!errors.isEmpty()) {
//       return next(
//         createError(400, 'Field validation failed.', {
//           fieldValidationErrors: errors.errors,
//         })
//       );
//     }
//
//     try {
//       const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//         returnDocument: 'after',
//       });
//       return res.status(200).json(user);
//     } catch (err) {
//       return next(err);
//     }
//   },
// ];
//
// // @desc    Delete a user
// // @route   DELETE /api/users/:id
// // @access  Private
// const deleteUser = (req, res, next) => {
//   // TODO
//   res.status(200).json({ message: `Delete user; id=${req.params.id}` });
// };

export default {
  createUser,
  loginUser,
  readCurrentUser,
  updateCurrentUser,
  readUsers,
};
