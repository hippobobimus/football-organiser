import { validationResult } from 'express-validator';
import createError from 'http-errors';

import * as userServices from '../services/userServices.js';
import { User } from '../models';
import { validateUser, processValidation } from '../middleware/validation';
import { authenticatePassword, generatePassword } from '../utils/password';

// @desc    Create user
// @route   POST /api/users
// @access  Public
const createUser = [
  validateUser.firstName(),
  validateUser.lastName(),
  validateUser.email(),
  validateUser.newPassword(),
  processValidation,
  async (req, res, next) => {
    try {
      const token = await userServices.createUser({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        newPassword: req.body.newPassword,
      });

      return res.status(200).json({ token });
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const loginUser = [
  validateUser.email(),
  validateUser.currentPassword(),
  processValidation,
  async (req, res, next) => {
    try {
      const token = await userServices.login({
        email: req.body.email,
        currentPassword: req.body.currentPassword,
      });
      return res.status(200).json({ token });
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
const readAuthUser = async (req, res, next) => {
  try {
    const user = await userServices.getUser(req.user.id);
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

// @desc    Edit current user
// @route   PUT /api/users/me
// @access  Private
const updateAuthUser = [
  validateUser.firstName().optional({ checkFalsy: true }),
  validateUser.lastName().optional({ checkFalsy: true }),
  validateUser.email().optional({ checkFalsy: true }),
  validateUser.newPassword().optional({ checkFalsy: true }),
  validateUser.currentPassword(),
  processValidation,
  async (req, res, next) => {
    let update = {
      firstName: req.body.firstName || null,
      lastName: req.body.lastName || null,
      email: req.body.email || null,
      newPassword: req.body.newPassword || null,
      currentPassword: req.body.currentPassword || null,
    };

    try {
      const user = await userServices.updateUser(req.user.id, update);
      // return updated user.
      return res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Get users
// @route   GET /api/users
// @access  Private
const readUsers = async (req, res, next) => {
  try {
    const users = await userServices.getUsers();
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
  readAuthUser,
  updateAuthUser,
  readUsers,
};
