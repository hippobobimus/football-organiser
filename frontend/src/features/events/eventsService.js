const API_URL = '/api/events/';

const getEvents = async (token) => {
  const response = await fetch(API_URL, {
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

const eventsService = { getEvents, getNextMatch };

export default eventsService;
