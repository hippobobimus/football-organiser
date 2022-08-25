import * as userServices from '../services/userServices.js';

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

export default { readUsers };
