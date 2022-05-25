const API_URL = '/api/events/';

const getEventAttendees = async (token, eventId) => {
  const response = await fetch(`${API_URL}${eventId}/attendees`, {
    method: 'GET',
    headers: {
      Authorization: token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  // fetch does not reject on http error status codes, must be handled separately.
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

const getCurrentUserEventAttendeeDetails = async (token, eventId) => {
  const response = await fetch(`${API_URL}${eventId}/attendees/me`, {
    method: 'GET',
    headers: {
      Authorization: token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  // fetch does not reject on http error status codes, must be handled separately.
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

const joinEvent = async (token, eventId) => {
  const response = await fetch(`${API_URL}${eventId}/join`, {
    method: 'PUT',
    headers: {
      Authorization: token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  // fetch does not reject on http error status codes, must be handled separately.
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

const leaveEvent = async (token, eventId) => {
  const response = await fetch(`${API_URL}${eventId}/leave`, {
    method: 'PUT',
    headers: {
      Authorization: token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  // fetch does not reject on http error status codes, must be handled separately.
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

const eventsService = {
  getEventAttendees,
  getCurrentUserEventAttendeeDetails,
  joinEvent,
  leaveEvent,
};

export default eventsService;
