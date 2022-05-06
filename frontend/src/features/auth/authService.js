// TODO make domain dynamic
const API_URL = 'http://localhost:5000/api/users/';

export const register = async (userData) => {
  let response;
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  } catch (err) {
    // network errors only, does not reject on http error status codes.
    console.error(err);
    throw new Error('Server error, please try again.');
  }

  const data = await response.json();
  console.log(data);

  if (response.ok) {
    console.log('Response ok!');
    return data;
  } else {
    console.log('Response not ok!');
    console.error(data);
    throw new Error(data.message);
  }
};

const authService = { register };

export default authService;
