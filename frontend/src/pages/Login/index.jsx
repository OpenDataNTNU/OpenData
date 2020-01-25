import React, { useState } from 'react';
import { Link as ReactLink } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Template } from '../../sharedComponents/Template';
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

const Button = styled.button`
  padding: 0.3em;
  font-size:1.1em;
  border-radius: 0.3em;
  color: #7e6dad;
  background-color: #dcd8ff;
  border: solid 0.1em #9a85d3;
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin: 1em 0 0.8em 0;
  cursor: pointer
`;

const Link = styled(ReactLink)`
  color: #434faf;
  text-decoration: underline;
`;

const Login = () => {
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redux
  // const dispatch = useDispatch();

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

    // dispatch(userActions.login(email, password))
  };

  return (
    <Template>
      <Wrapper>
        <Form onSubmit={login}>
          <h1>Login</h1>
          <Input type="email" placeholder="Email" name="email" value={email} onChange={onChange} />
          <Input type="password" placeholder="Password" name="password" value={password} onChange={onChange} />
          <Button type="submit">Sign in</Button>
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
