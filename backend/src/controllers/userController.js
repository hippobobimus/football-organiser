import * as userServices from '../services/userServices.js';
import { validateUser, processValidation } from '../middleware/validation';

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

export default {
  createUser,
  loginUser,
  readAuthUser,
  updateAuthUser,
  readUsers,
};
