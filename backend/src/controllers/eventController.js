// @desc    Get events
// @route   GET /api/events
// @access  Private
const readEvents = (req, res, next) => {
  res.status(200).json({ message: 'Get all events' });
};

// @desc    Create event
// @route   POST /api/events
// @access  Private
const createEvent = (req, res, next) => {
  res.status(200).json({ message: 'Create an event' });
};

// @desc    Get an event
// @route   GET /api/events/:id
// @access  Private
const readEvent = (req, res, next) => {
  res.status(200).json({ message: `Get an event; id=${req.params.id}` });
};

// @desc    Edit event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = (req, res, next) => {
  res.status(200).json({ message: `Update event; id=${req.params.id}` });
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = (req, res, next) => {
  res.status(200).json({ message: `Delete event; id=${req.params.id}` });
};

export default { readEvents, createEvent, readEvent, updateEvent, deleteEvent };
