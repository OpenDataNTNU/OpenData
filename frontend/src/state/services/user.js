// Login a user with email and password
async function login(email, password) {
  const url = '/login';

  const data = {
    email,
    password,
  };

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  });

  return response.json();
}

// Register a user with email and password
async function register(email, password) {
  const url = '/register';

  const data = {
    email,
    password,
  };

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  });

  return response.json();
}

const userService = {
  login,
  register,
};

export {
  userService,
};
