// @desc    Get users
// @route   GET /api/users
// @access  Private
const readUsers = (req, res, next) => {
  res.status(200).json({ message: 'Get all users' });
};

// @desc    Create user
// @route   POST /api/users
// @access  Private
const createUser = (req, res, next) => {
  res.status(200).json({ message: 'Create a user' });
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
