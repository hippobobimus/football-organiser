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

const getAuthUserEventAttendee = async (token, eventId) => {
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

const addAuthUserToEvent = async (token, eventId) => {
  const response = await fetch(`${API_URL}${eventId}/attendees/me`, {
    method: 'POST',
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

const removeAuthUserFromEvent = async (token, eventId) => {
  const response = await fetch(`${API_URL}${eventId}/attendees/me`, {
    method: 'DELETE',
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

const updateAuthUserEventAttendee = async (token, {eventId, ...params}) => {
  const response = await fetch(`${API_URL}${eventId}/attendees/me`, {
    method: 'PUT',
    headers: {
      Authorization: token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  // fetch does not reject on http error status codes, must be handled separately.
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

const attendeesService = {
  getEventAttendees,
  getAuthUserEventAttendee,
  addAuthUserToEvent,
  removeAuthUserFromEvent,
  updateAuthUserEventAttendee,
};

export default attendeesService;
