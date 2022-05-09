// TODO make domain dynamic
const API_URL = 'http://localhost:5000/api/users/';

const register = async (userData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  // fetch does not reject on http error status codes, must be handled separately.
  if (!response.ok) {
    throw new Error(data.message);
  }

  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

const login = async (userData) => {
  const response = await fetch(API_URL + 'login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  // fetch does not reject on http error status codes, must be handled separately.
  if (!response.ok) {
    throw new Error(data.message);
  }

  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

const logout = async () => {
  localStorage.removeItem('user');
};

const authService = { register, login, logout };

export default authService;
