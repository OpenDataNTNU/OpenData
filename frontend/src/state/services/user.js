// Login a user with email and password
async function login(email, password) {
  const url = '/api/User/auth';

  const data = {
    mail: email,
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

  if (response.ok && response.status === 200) {
    const user = await response.json();
    return user;
  }

  if (response.status === 500) {
    throw new Error('Internal Server Error');
  } else if (response.status === 401) {
    throw new Error('Incorrect mail or password');
  } else {
    throw new Error('Unexpected error');
  }
}

// Register a user with email and password
async function register(email, password, type) {
  const url = '/api/User';

  const data = {
    mail: email,
    password,
    type,
  };

  const response = await fetch(url, {
    method: 'PUT',
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

  if (response.ok && response.status === 200) {
    const responseData = await response.json();
    return responseData;
  }

  if (response.status === 500) {
    throw new Error('Internal Server Error');
  } else if (response.status === 400) {
    const errorMessage = response.json();
    throw new Error(errorMessage.messsage);
  } else {
    throw new Error('Unexpected error');
  }
}

const userService = {
  login,
  register,
};

export {
  userService,
};
