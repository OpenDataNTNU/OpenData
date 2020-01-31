import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link as ReactLink } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Template } from '../../sharedComponents/Template';
import { LoadingButton } from '../../sharedComponents/LoadingButton';
// import { userActions } from '../../state/actions/user';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
  background-color: #f5f5f5;
  height: 100%;
  width: 100%;
`;

const Form = styled.form`
  max-width: 30em;
  display: flex;
  flex-direction: column;
  padding: 1em;
  background-color: white;
  border-radius: 0.3em;
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
`;

const Input = styled.input`
  padding: 0.3em;
  font-size:1.1em;
  border-radius: 0.3em;
  border: solid 0.1em lightgrey;
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin: 0.3em 0 0.3em 0;
`;

const Link = styled(ReactLink)`
  color: #434faf;
  text-decoration: underline;
`;

const Login = () => {
  // Redux state
  const user = useSelector((state) => state.user);

  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redux
  // const dispatch = useDispatch();

  // check if the logging in is initalized or loggedIn is initilized
  // if they arent then the button is set back to loading
  // Essentially this means the loading will stop on logging error
  useEffect(() => {
    if (user && !user.loggingIn && !user.loggedIn) {
      setLoading(false);
    }
  }, [user]);

  const onChange = (e) => {
    switch (e.target.name) {
      case 'email': {
        setEmail(e.target.value);
        break;
      }
      case 'password': {
        setPassword(e.target.value);
        break;
      }
      default: {
        break;
      }
    }
  };

  const login = (e) => {
    e.preventDefault();
    setLoading(true);

    // dispatch(userActions.login(email, password))
  };

  return (
    <Template>
      <Wrapper>
        <Form>
          <h1>Login</h1>
          <Input type="email" placeholder="Email" name="email" value={email} onChange={onChange} />
          <Input type="password" placeholder="Password" name="password" value={password} onChange={onChange} />
          <LoadingButton text="Sign in" onClick={login} loading={loading} />
          <p>
            Not a user yet? &nbsp;
            <Link to="/register">Sign up here</Link>
          </p>
        </Form>
      </Wrapper>
    </Template>
  );
};

export {
  Login,
};
