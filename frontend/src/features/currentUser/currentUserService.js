const API_URL = '/api/users/me';

const getCurrentUser = async (token) => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      Authorization: token,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  console.log(data);

  // fetch does not reject on http error status codes, must be handled separately.
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

const currentUserService = { getCurrentUser };

export default currentUserService;
