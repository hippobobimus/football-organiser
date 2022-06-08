const API_URL = '/api/events/';

const getEvents = async (token, queryParams) => {
  const queryString = Object.entries(queryParams)
    .map(([key, val]) => `${key}=${val}`)
    .join('&');

  const url = `${API_URL}${queryString ? '?' : ''}${queryString}`;

  const response = await fetch(url, {
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

const getOneEvent = async (token, eventId) => {
  const response = await fetch(`${API_URL}${eventId}`, {
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

const getNextMatch = async (token) => {
  const response = await fetch(`${API_URL}next-match`, {
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

const createEvent = async (token, eventData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });

  const data = await response.json();

  // fetch does not reject on http error status codes, must be handled separately.
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

const updateEvent = async (token, {id, update}) => {
  const response = await fetch(API_URL + id, {
    method: 'PUT',
    headers: {
      Authorization: token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(update),
  });

  const data = await response.json();

  // fetch does not reject on http error status codes, must be handled separately.
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

const deleteEvent = async (token, id) => {
  const response = await fetch(API_URL + id, {
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

const updateAuthUserEventAttendee = async (token, { eventId, ...params }) => {
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

const eventsService = {
  getEvents,
  getOneEvent,
  getNextMatch,
  createEvent,
  updateEvent,
  deleteEvent,
  addAuthUserToEvent,
  removeAuthUserFromEvent,
  updateAuthUserEventAttendee,
};

export default eventsService;
