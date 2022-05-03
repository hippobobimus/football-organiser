import { User } from '../models';
// @desc    Get users
// @route   GET /api/users
// @access  Private
const readUsers = async (req, res) => {
  const users = await User.find();

  res.status(200).json(users);
};

// @desc    Create user
// @route   POST /api/users
// @access  Private
const createUser = async (req, res, next) => {
  if (!req.body.firstName || !req.body.lastName) {
    res.status(400);
    throw new Error('Please enter a first and last name');
  }

  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  res.status(200).json(user);
};

// @desc    Get a user
// @route   GET /api/users/:id
// @access  Private
const readUser = (req, res, next) => {
  res.status(200).json({ message: `Get a user; id=${req.params.id}` });
};

// @desc    Edit user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = (req, res, next) => {
  res.status(200).json({ message: `Update user; id=${req.params.id}` });
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = (req, res, next) => {
  res.status(200).json({ message: `Delete user; id=${req.params.id}` });
};

export default { readUsers, createUser, readUser, updateUser, deleteUser };
