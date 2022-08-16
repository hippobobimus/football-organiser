import * as authServices from '../services/authServices';
import * as userServices from '../services/userServices';
import { validateUser, processValidation } from '../middleware/validation';
import { REFRESH_COOKIE_MAX_AGE_MS } from '../config/index.js';

const refreshTokenCookieOptions = {
  httpOnly: true,
  maxAge: REFRESH_COOKIE_MAX_AGE_MS,
  // TODO
  // secure: true,
  // sameSite: 'strict',
};

// @desc    Create a new user
// @route   POST /api/auth/register
// @access  Public
const register = [
  validateUser.firstName(),
  validateUser.lastName(),
  validateUser.email(),
  validateUser.newPassword(),
  processValidation,
  async (req, res, next) => {
    try {
      const { refreshToken, accessToken } = await authServices.registerUser({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        newPassword: req.body.newPassword,
      });

      return res
        .status(200)
        .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
        .json({ accessToken });
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
const login = [
  validateUser.email(),
  validateUser.currentPassword(),
  processValidation,
  async (req, res, next) => {
    try {
      const { refreshToken, accessToken } = await authServices.login({
        email: req.body.email,
        currentPassword: req.body.currentPassword,
      });

      return res
        .status(200)
        .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
        .json({ accessToken });
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Logout the current authenticated user
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res, next) => {
  try {
    await authServices.logout(req.cookies?.refreshToken);
    return res.status(204).clearCookie('refreshToken');
  } catch (err) {
    return next(err);
  }
};

// @desc    Refresh access token
// @route   GET /api/auth/refresh
// @access  Private
const refresh = async (req, res, next) => {
  try {
    const { refreshToken, accessToken } = await authServices.refreshAccessToken(
      req.cookies?.refreshToken
    );

    return res
      .status(200)
      .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
      .json({ accessToken });
  } catch (err) {
    return next(err);
  }
};

// @desc    Get current authenticated user
// @route   GET /api/auth/user
// @access  Private
const readAuthUser = async (req, res, next) => {
  try {
    const user = await userServices.getUser(req.user.id);
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

export default { login, logout, register, refresh, readAuthUser };
