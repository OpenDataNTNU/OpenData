import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
import styled from 'styled-components';

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

const Register = () => {
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');

  // Redux
  // const dispatch = useDispatch()

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
      case 'verifyPassword': {
        setVerifyPassword(e.target.value);
        break;
      }
      default: {
        break;
      }
    }
  };

  const register = (e) => {
    e.preventDefault();

    // dispatch(userActions.register(email, password))
  };

  return (
    <Wrapper>
      <Form onSubmit={register}>
        <h1>Sign up</h1>
        <Input type="text" placeholder="Email" name="email" value={email} onChange={onChange} />
        <Input type="password" placeholder="Password" name="password" value={password} onChange={onChange} />
        <Input type="password" placeholder="Verify password" name="verifyPassword" value={verifyPassword} onChange={onChange} />
        <Button type="submit">Create account</Button>
      </Form>
    </Wrapper>
  );
};

export {
  Register,
};
