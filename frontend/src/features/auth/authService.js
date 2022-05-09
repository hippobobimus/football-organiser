// TODO make domain dynamic
const API_URL = 'http://localhost:5000/api/users/';

export const register = async (userData) => {
  // does not reject on http error status codes, must be handled separately.
  const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } else {
    throw new Error(data.message);
  }
};

const authService = { register };

export default authService;
